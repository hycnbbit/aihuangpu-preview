#!/usr/bin/env python3
"""Extract student project archives and build the showcase manifest.

The showcase is deliberately generated at build/dev time instead of hard-coding
one-off project data in React. Put a supported archive anywhere in the project
(except generated folders), run `pnpm works:prepare`, and the site will pick up
new projects automatically.

Zip files created on Chinese Windows machines are decoded as GBK when their
filename flag does not explicitly declare UTF-8. Unsafe paths and agent/tool
metadata are ignored so an uploaded archive cannot write outside the public
showcase directory.
"""

from __future__ import annotations

import hashlib
import html as html_lib
import json
import os
import re
import shutil
import tarfile
import zipfile
from html.parser import HTMLParser
from pathlib import Path, PurePosixPath
from typing import Any, Iterable
from urllib.parse import quote

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "client" / "public" / "student-works"
DEPLOY_BASE = os.environ.get("VITE_BASE_PATH", "/").strip() or "/"
if not DEPLOY_BASE.startswith("/"):
    DEPLOY_BASE = f"/{DEPLOY_BASE}"
DEPLOY_BASE = "" if DEPLOY_BASE == "/" else DEPLOY_BASE.rstrip("/")
SUPPORTED_ARCHIVES = {".zip", ".tar", ".tgz", ".gz"}
WEB_EXTENSIONS = {
    ".html",
    ".htm",
    ".css",
    ".js",
    ".mjs",
    ".json",
    ".svg",
    ".png",
    ".jpg",
    ".jpeg",
    ".webp",
    ".gif",
    ".avif",
    ".ico",
    ".mp3",
    ".wav",
    ".ogg",
    ".mp4",
    ".webm",
    ".woff",
    ".woff2",
    ".ttf",
    ".otf",
}

# The archive contains a few names which carry more context than can be
# reliably inferred by splitting Chinese text. Keep this small mapping as an
# override while allowing future archives to fall back to their folder name.
GROUP_META: dict[str, dict[str, Any]] = {
    "朱辰宇": {"authors": ["朱辰宇"], "title": "摸金行动 3D"},
    "张宇斌姚天远": {"authors": ["张宇斌", "姚天远"], "title": "前线 · 第一人称射击"},
    "岳唐书瑜 唐泽坤": {"authors": ["岳唐书瑜", "唐泽坤"], "title": "恐龙学习实验室"},
    "闫书文、梁彬锐": {"authors": ["闫书文", "梁彬锐"], "title": "数学计算题练习"},
    "晋楹记 原一涵·马歆笛·柳雅馨": {
        "authors": ["原一涵", "马歆笛", "柳雅馨"],
        "title": "晋楹记 · 沉浸式古建学堂",
    },
    "常卓尔柳泽韬": {"authors": ["常卓尔", "柳泽韬"], "title": "山西历史战斗"},
}

ROOT_META: dict[str, dict[str, Any]] = {
    "index_副本.html": {"authors": ["待补充"], "title": "闯关学堂 · 答题解锁小游戏"},
    "三晋行王歆然任钦煜任钦楷.html": {
        "authors": ["王歆然", "任钦煜", "任钦楷"],
        "title": "三晋行 · 山西文旅闯关",
    },
    "环保大闯关刘灵兮王子墨.html": {
        "authors": ["刘灵兮", "王子墨"],
        "title": "环保大闯关",
    },
}

PROJECT_META: dict[str, dict[str, Any]] = {
    "摸金行动 3D": {
        "description": "一场第一视角的搜刮与射击冒险，把空间探索、资源判断和即时反馈做成了可以直接玩的体验。",
        "category": "互动游戏",
        "tags": ["3D", "FPS", "沉浸体验"],
    },
    "前线 · 第一人称射击": {
        "description": "从零搭建的第一人称射击体验，包含战斗反馈、生命状态与清晰的任务节奏。",
        "category": "互动游戏",
        "tags": ["FPS", "动作", "游戏机制"],
    },
    "恐龙学习实验室": {
        "description": "把背单词和自然探索放进同一个小宇宙，学习任务被重新设计成更轻松、更有反馈的游戏过程。",
        "category": "学习工具",
        "tags": ["学习", "游戏化", "亲子"],
    },
    "数学计算题练习": {
        "description": "一个会记录错题的数学练习工具，用即时反馈和分阶段练习，让训练过程更有节奏。",
        "category": "学习工具",
        "tags": ["教育", "练习", "错题本"],
    },
    "晋楹记 · 沉浸式古建学堂": {
        "description": "以山西古建为入口的沉浸式学习页面，把榫卯、建筑知识和探索路径连接成一段可浏览的文化体验。",
        "category": "文化与公益",
        "tags": ["山西", "古建", "文化"],
    },
    "山西历史战斗": {
        "description": "用集卡、战斗和种树串起山西历史人物，让历史知识有了更具参与感的互动入口。",
        "category": "文化与公益",
        "tags": ["历史", "集卡", "互动"],
    },
    "三晋行 · 山西文旅闯关": {
        "description": "从北到南探索山西，把地方文化、路线信息与闯关机制放进一个轻量的旅行体验中。",
        "category": "文化与公益",
        "tags": ["文旅", "闯关", "山西"],
    },
    "环保大闯关": {
        "description": "通过闯关、环保商店和日常任务，把绿色生活变成一场有目标、有奖励的互动挑战。",
        "category": "文化与公益",
        "tags": ["环保", "闯关", "公益"],
    },
    "闯关学堂 · 答题解锁小游戏": {
        "description": "把知识问答变成可以不断解锁的小游戏，用轻量任务让学习从屏幕上真正动起来。",
        "category": "学习工具",
        "tags": ["问答", "闯关", "学习"],
    },
}

CATEGORY_ACCENTS = {
    "互动游戏": {"accent": "#ffb84d", "soft": "#3a2717"},
    "学习工具": {"accent": "#78d6c4", "soft": "#123b3d"},
    "文化与公益": {"accent": "#ff806e", "soft": "#3f2527"},
    "创意体验": {"accent": "#b7a4ff", "soft": "#282141"},
}

# Vector posters are generated for projects that do not ship a suitable image.
# They are intentionally topic-led rather than generic placeholders, so every
# student project still has a recognisable visual identity in the archive.
COVER_STORIES = {
    "晋楹记 · 沉浸式古建学堂": {"mark": "晋", "label": "SHANXI ARCHITECTURE", "scene": "heritage"},
    "山西历史战斗": {"mark": "战", "label": "HISTORY QUEST", "scene": "history"},
    "前线 · 第一人称射击": {"mark": "FPS", "label": "FIRST PERSON MISSION", "scene": "game"},
    "数学计算题练习": {"mark": "Σ", "label": "MATH PRACTICE", "scene": "study"},
    "闯关学堂 · 答题解锁小游戏": {"mark": "Q", "label": "UNLOCK THE ANSWER", "scene": "study"},
    "三晋行 · 山西文旅闯关": {"mark": "晋", "label": "SHANXI FIELD TRIP", "scene": "travel"},
    "环保大闯关": {"mark": "绿", "label": "ECO CHALLENGE", "scene": "eco"},
}


def generated_cover_svg(title: str, accent: dict[str, str]) -> str:
    story = COVER_STORIES.get(title, {"mark": "AI", "label": "STUDENT PLAYABLE WORK", "scene": "default"})
    primary = accent["accent"]
    soft = accent["soft"]
    scene = story["scene"]
    illustrations = {
        "heritage": '''
  <path d="M650 535L855 332l205 203H650Z" fill="none" stroke="currentColor" stroke-width="12" />
  <path d="M700 535V440h310v95M748 440v-57h215v57M790 383v-48h130v48" fill="none" stroke="currentColor" stroke-width="12" />
  <path d="M625 566h465M665 592h385" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" opacity=".7" />
''',
        "history": '''
  <path d="M662 555c100-150 218-164 390-42" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" />
  <path d="M697 595c72-90 205-135 344-58" fill="none" stroke="currentColor" stroke-width="7" stroke-linecap="round" opacity=".72" />
  <path d="M753 264v176l78-43 77 43V264l-77-43-78 43Z" fill="currentColor" fill-opacity=".16" stroke="currentColor" stroke-width="8" />
  <path d="M831 246v129" stroke="currentColor" stroke-width="7" />
''',
        "game": '''
  <circle cx="854" cy="408" r="138" fill="none" stroke="currentColor" stroke-width="8" />
  <circle cx="854" cy="408" r="75" fill="currentColor" fill-opacity=".12" stroke="currentColor" stroke-width="5" />
  <path d="M854 218v86M854 512v86M664 408h86M958 408h86" stroke="currentColor" stroke-width="9" stroke-linecap="round" />
  <path d="M670 595l184-106 188 106" fill="none" stroke="currentColor" stroke-width="8" opacity=".58" />
''',
        "study": '''
  <rect x="667" y="250" width="380" height="312" rx="24" fill="currentColor" fill-opacity=".09" stroke="currentColor" stroke-width="7" />
  <path d="M715 327h142M715 374h260M715 421h207M715 468h116" stroke="currentColor" stroke-width="10" stroke-linecap="round" opacity=".8" />
  <circle cx="970" cy="327" r="24" fill="currentColor" fill-opacity=".75" />
  <path d="M942 486l38 34 73-88" fill="none" stroke="currentColor" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" />
''',
        "travel": '''
  <path d="M670 526c89-177 171 50 252-106 35-67 83-73 134-22" fill="none" stroke="currentColor" stroke-width="11" stroke-linecap="round" stroke-dasharray="2 24" />
  <circle cx="696" cy="481" r="20" fill="currentColor" /><circle cx="919" cy="419" r="20" fill="currentColor" /><circle cx="1052" cy="398" r="20" fill="currentColor" />
  <path d="M664 570h396" stroke="currentColor" stroke-width="7" opacity=".58" />
''',
        "eco": '''
  <path d="M860 593c-151-92-166-240-83-331 143 30 211 160 83 331Z" fill="currentColor" fill-opacity=".13" stroke="currentColor" stroke-width="9" />
  <path d="M807 539c42-91 98-160 161-215M777 404c53 1 96 24 128 65" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" />
  <path d="M694 587h334" stroke="currentColor" stroke-width="7" opacity=".58" />
''',
        "default": '''
  <circle cx="856" cy="407" r="138" fill="none" stroke="currentColor" stroke-width="8" />
  <path d="M746 475l110-162 110 162H746Z" fill="currentColor" fill-opacity=".14" stroke="currentColor" stroke-width="8" />
''',
    }
    illustration = illustrations.get(scene, illustrations["default"])
    mark = html_lib.escape(str(story["mark"]))
    label = html_lib.escape(str(story["label"]))
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 800">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="{soft}" />
      <stop offset="100%" stop-color="#08151c" />
    </linearGradient>
    <pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse">
      <path d="M42 0H0V42" fill="none" stroke="#f7f1e5" stroke-opacity=".06" />
    </pattern>
  </defs>
  <rect width="1200" height="800" fill="url(#bg)" />
  <rect width="1200" height="800" fill="url(#grid)" />
  <circle cx="938" cy="364" r="300" fill="{primary}" fill-opacity=".08" />
  <g style="color:{primary}">{illustration}</g>
  <text x="194" y="176" fill="#f7f1e5" fill-opacity=".78" font-family="Arial, 'Noto Sans SC', sans-serif" font-size="20" font-weight="700" letter-spacing="4">{label}</text>
  <text x="190" y="680" fill="{primary}" fill-opacity=".9" font-family="Arial, 'Noto Serif SC', serif" font-size="206" font-weight="700">{mark}</text>
  <path d="M192 718H512" stroke="{primary}" stroke-width="7" stroke-linecap="round" />
  <text x="194" y="758" fill="#f7f1e5" fill-opacity=".58" font-family="Arial, 'Noto Sans SC', sans-serif" font-size="17" letter-spacing="3">AI HUANGPU / STUDENT WORKS</text>
</svg>'''


def is_under(path: Path, parent: Path) -> bool:
    try:
        path.relative_to(parent)
        return True
    except ValueError:
        return False


def archive_candidates() -> list[Path]:
    result: list[Path] = []
    for path in ROOT.rglob("*"):
        if not path.is_file() or path.suffix.lower() not in SUPPORTED_ARCHIVES:
            continue
        if any(is_under(path, ignored) for ignored in (ROOT / "node_modules", ROOT / "dist", OUTPUT, ROOT / ".git")):
            continue
        # .gz by itself is not useful; .tar.gz is accepted by tarfile.
        if path.suffix.lower() == ".gz" and not path.name.lower().endswith(".tar.gz"):
            continue
        result.append(path)
    return sorted(result, key=lambda p: str(p).lower())


def normalized_member_name(name: str) -> PurePosixPath | None:
    name = name.replace("\\", "/")
    path = PurePosixPath(name)
    if path.is_absolute() or not path.parts:
        return None
    if any(part in {"", ".", ".."} or part.startswith(".") for part in path.parts):
        return None
    return path


def is_web_file(path: PurePosixPath) -> bool:
    return path.suffix.lower() in WEB_EXTENSIONS


def zip_members(path: Path) -> list[tuple[PurePosixPath, zipfile.ZipInfo, zipfile.ZipFile]]:
    try:
        archive = zipfile.ZipFile(path, "r", metadata_encoding="gbk")
    except TypeError:
        archive = zipfile.ZipFile(path, "r")

    result: list[tuple[PurePosixPath, zipfile.ZipInfo, zipfile.ZipFile]] = []
    for info in archive.infolist():
        normalized = normalized_member_name(info.filename)
        if (
            normalized is None
            or info.is_dir()
            or normalized.name.startswith("_verify")
            or not is_web_file(normalized)
        ):
            continue
        # Do not extract symbolic links from untrusted archives.
        mode = (info.external_attr >> 16) & 0o170000
        if mode == 0o120000:
            continue
        result.append((normalized, info, archive))
    return result


def tar_members(path: Path) -> list[tuple[PurePosixPath, tarfile.TarInfo, tarfile.TarFile]]:
    archive = tarfile.open(path, "r:*")
    result: list[tuple[PurePosixPath, tarfile.TarInfo, tarfile.TarFile]] = []
    for info in archive.getmembers():
        normalized = normalized_member_name(info.name)
        if (
            normalized is None
            or not info.isfile()
            or normalized.name.startswith("_verify")
            or not is_web_file(normalized)
        ):
            continue
        result.append((normalized, info, archive))
    return result


def close_archives(items: Iterable[tuple[Any, Any, Any]]) -> None:
    seen: set[int] = set()
    for _, _, archive in items:
        if id(archive) in seen:
            continue
        seen.add(id(archive))
        archive.close()


def read_member(item: tuple[PurePosixPath, Any, Any]) -> bytes:
    _, info, archive = item
    if isinstance(archive, zipfile.ZipFile):
        return archive.read(info)
    handle = archive.extractfile(info)
    return handle.read() if handle else b""


THREE_IMPORTS = {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/",
}


def normalize_student_source(data: bytes, source_path: PurePosixPath) -> bytes:
    if source_path.suffix.lower() not in {".html", ".htm", ".js", ".mjs"}:
        return data
    text = data.decode("utf-8", errors="ignore")
    has_three_import = any(
        re.search(rf"from\s+['\"]{re.escape(spec)}", text)
        for spec in THREE_IMPORTS
    )
    if not has_three_import:
        return data

    for spec, replacement in sorted(THREE_IMPORTS.items(), key=lambda item: len(item[0]), reverse=True):
        text = text.replace(f"from '{spec}", f"from '{replacement}")
        text = text.replace(f'from \"{spec}', f'from \"{replacement}')

    # Some archived projects use Three.js add-on modules which themselves
    # import the bare `three` specifier. An import map keeps those modules
    # playable without forcing the whole website to bundle Three.js.
    if source_path.suffix.lower() in {".html", ".htm"} and "type=\"importmap\"" not in text:
        import_map = '''<script type="importmap">{
  "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/"
  }
}</script>'''
        text = text.replace("</head>", f"{import_map}</head>", 1)
    return text.encode("utf-8")


def write_member(item: tuple[PurePosixPath, Any, Any], target: Path) -> None:
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(normalize_student_source(read_member(item), item[0]))


class HTMLMetaParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.title: list[str] = []
        self.description = ""
        self.headings: list[str] = []
        self._in_title = False
        self._heading_level: int | None = None

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        values = {key.lower(): value or "" for key, value in attrs}
        if tag.lower() == "title":
            self._in_title = True
        if tag.lower() in {"h1", "h2"}:
            self._heading_level = 1
        if tag.lower() == "meta" and values.get("name", "").lower() == "description":
            self.description = values.get("content", "").strip()

    def handle_endtag(self, tag: str) -> None:
        if tag.lower() == "title":
            self._in_title = False
        if tag.lower() in {"h1", "h2"}:
            self._heading_level = None

    def handle_data(self, data: str) -> None:
        clean = re.sub(r"\s+", " ", html_lib.unescape(data)).strip()
        if not clean:
            return
        if self._in_title:
            self.title.append(clean)
        if self._heading_level is not None and len(self.headings) < 4:
            self.headings.append(clean)


def parse_html(raw: bytes) -> HTMLMetaParser:
    parser = HTMLMetaParser()
    parser.feed(raw.decode("utf-8", errors="ignore"))
    return parser


def url_path(*parts: str) -> str:
    return DEPLOY_BASE + "/" + "/".join(quote(str(part), safe="") for part in parts)


def fallback_authors(group: str) -> list[str]:
    pieces = [piece.strip() for piece in re.split(r"[、,，·\s]+", group) if piece.strip()]
    return pieces or [group]


def get_category(title: str) -> str:
    meta = PROJECT_META.get(title)
    if meta:
        return str(meta["category"])
    haystack = title.lower()
    if any(word in haystack for word in ("数学", "恐龙", "单词", "学堂", "答题")):
        return "学习工具"
    if any(word in title for word in ("山西", "环保", "三晋", "古建")):
        return "文化与公益"
    if any(word in haystack for word in ("fps", "3d", "射击", "战斗")):
        return "互动游戏"
    return "创意体验"


def description_for(title: str, parser: HTMLMetaParser, authors: list[str], category: str) -> str:
    meta = PROJECT_META.get(title)
    if meta and meta.get("description"):
        return str(meta["description"])
    if parser.description:
        return parser.description[:160]
    author_label = "、".join(authors)
    if parser.headings:
        return f"{parser.headings[0]}：一个由{author_label}完成的{category}作品。"
    return f"一个由{author_label}完成的{category}互动作品，把想法做成了可以直接打开和体验的网页。"


def work_title(raw_title: str, parser: HTMLMetaParser) -> str:
    title = raw_title.strip()
    if title in PROJECT_META:
        return title
    parsed = "".join(parser.title).strip()
    if parsed:
        parsed = re.sub(r"\s+", " ", parsed)
        return parsed.split("|")[0].strip()[:80]
    return title


def project_metadata(group: str | None, source_name: str, parser: HTMLMetaParser) -> tuple[str, list[str]]:
    if group and group in GROUP_META:
        meta = GROUP_META[group]
        return str(meta.get("title", group)), list(meta["authors"])
    if not group and source_name in ROOT_META:
        meta = ROOT_META[source_name]
        return str(meta.get("title", source_name)), list(meta["authors"])
    raw = group or Path(source_name).stem
    title = work_title(raw, parser)
    return title, fallback_authors(group or "待补充")


def build_project(
    project_id: str,
    group: str | None,
    root_file: PurePosixPath | None,
    members: list[tuple[PurePosixPath, Any, Any]],
    output: Path,
) -> dict[str, Any] | None:
    html_items = [item for item in members if item[0].suffix.lower() in {".html", ".htm"}]
    if not html_items:
        return None

    parsed_items: list[tuple[tuple[PurePosixPath, Any, Any], HTMLMetaParser]] = []
    for item in html_items:
        parsed_items.append((item, parse_html(read_member(item))))

    if group:
        def relative_path(item: tuple[PurePosixPath, Any, Any]) -> PurePosixPath:
            return item[0].relative_to(PurePosixPath(group))
    else:
        def relative_path(item: tuple[PurePosixPath, Any, Any]) -> PurePosixPath:
            return PurePosixPath("index.html")

    # Prefer an index at project root, then deploy/index.html, then the first HTML file.
    sorted_html = sorted(parsed_items, key=lambda pair: str(relative_path(pair[0])).lower())
    primary_item = next(
        (pair for pair in sorted_html if str(relative_path(pair[0])).lower() == "index.html"),
        None,
    )
    if primary_item is None:
        primary_item = next(
            (pair for pair in sorted_html if str(relative_path(pair[0])).lower() == "deploy/index.html"),
            sorted_html[0],
        )

    primary_parser = primary_item[1]
    source_name = root_file.name if root_file else group or "student-project"
    title, authors = project_metadata(group, source_name, primary_parser)
    title = work_title(title, primary_parser)
    category = get_category(title)
    meta = PROJECT_META.get(title, {})
    description = description_for(title, primary_parser, authors, category)
    tags = list(meta.get("tags", []))
    if "HTML" not in tags:
        tags.append("HTML")
    accent = CATEGORY_ACCENTS.get(category, CATEGORY_ACCENTS["创意体验"])

    target = output / project_id
    target.mkdir(parents=True, exist_ok=True)
    copied_paths: list[PurePosixPath] = []
    for item in members:
        source_path = item[0]
        if group:
            try:
                destination_relative = source_path.relative_to(PurePosixPath(group))
            except ValueError:
                continue
        else:
            # Root-level HTML files are isolated into their own self-contained project.
            if source_path.suffix.lower() in {".html", ".htm"}:
                destination_relative = PurePosixPath("index.html")
            else:
                destination_relative = source_path
        if not destination_relative.parts:
            continue
        destination = target.joinpath(*destination_relative.parts)
        write_member(item, destination)
        copied_paths.append(destination_relative)

    image_paths = sorted(
        [path for path in copied_paths if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"}],
        key=lambda value: str(value).lower(),
    )
    if image_paths:
        cover_path = image_paths[0]
    else:
        # A project may be fully self-contained HTML/CSS with no raster asset.
        # Give it a real, lightweight cover instead of leaving an empty tile.
        cover_path = PurePosixPath("cover.svg")
        cover_svg = generated_cover_svg(title, accent)
        (target / cover_path).write_text(cover_svg, encoding="utf-8")
        copied_paths.append(cover_path)
    cover = url_path("student-works", project_id, *cover_path.parts)

    works: list[dict[str, Any]] = []
    for index, (item, parser) in enumerate(sorted_html, start=1):
        relative = relative_path(item)
        entry = url_path("student-works", project_id, *relative.parts)
        item_title = work_title(title if index == 1 else str(relative.stem), parser)
        if index != 1 and parser.title:
            item_title = work_title(str(relative.stem), parser)
        works.append(
            {
                "id": f"{project_id}-work-{index}",
                "title": item_title,
                "entry": entry,
                "cover": cover,
                "playable": True,
            }
        )

    digest = hashlib.sha1(f"{project_id}:{title}".encode("utf-8")).hexdigest()[:8]
    return {
        "id": project_id,
        "slug": project_id,
        "title": title,
        "authors": authors,
        "authorLabel": "、".join(authors),
        "description": description,
        "category": category,
        "tags": tags,
        "accent": accent["accent"],
        "accentSoft": accent["soft"],
        "cover": cover,
        "entry": works[0]["entry"],
        "playable": True,
        "works": works,
        "projectCount": len(works),
        "source": source_name,
        "signature": digest,
    }


def collect_archive_projects(archive_path: Path, output: Path, start_index: int) -> tuple[list[dict[str, Any]], list[str], int]:
    if archive_path.suffix.lower() == ".zip":
        items = zip_members(archive_path)
    else:
        items = tar_members(archive_path)

    try:
        root_htmls = [item for item in items if len(item[0].parts) == 1 and item[0].suffix.lower() in {".html", ".htm"}]
        root_assets = [item for item in items if len(item[0].parts) == 1 and is_web_file(item[0]) and item[0].suffix.lower() not in {".html", ".htm"}]
        grouped: dict[str, list[tuple[PurePosixPath, Any, Any]]] = {}
        for item in items:
            if len(item[0].parts) > 1:
                grouped.setdefault(item[0].parts[0], []).append(item)

        projects: list[dict[str, Any]] = []
        warnings: list[str] = []
        current_index = start_index
        priority_groups = {"晋楹记 原一涵·马歆笛·柳雅馨": 0}
        ordered_groups = sorted(
            grouped,
            key=lambda group: (priority_groups.get(group, 1), group),
        )
        for group in ordered_groups:
            if not any(item[0].suffix.lower() in {".html", ".htm"} for item in grouped[group]):
                continue
            current_index += 1
            project = build_project(f"work-{current_index:02d}", group, None, grouped[group], output)
            if project:
                projects.append(project)

        # A few archives export standalone HTML files into their root. Treat
        # each as a separate project and include root-level assets as context.
        for root_item in sorted(root_htmls, key=lambda item: str(item[0]).lower()):
            current_index += 1
            project_members = [root_item, *root_assets]
            project = build_project(f"work-{current_index:02d}", None, root_item[0], project_members, output)
            if project:
                projects.append(project)

        if not projects:
            warnings.append(f"未找到可展示的 HTML 作品：{archive_path.name}")
        return projects, warnings, current_index
    finally:
        close_archives(items)


def main() -> None:
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    if OUTPUT.exists():
        shutil.rmtree(OUTPUT)
    OUTPUT.mkdir(parents=True, exist_ok=True)

    archives = archive_candidates()
    projects: list[dict[str, Any]] = []
    warnings: list[str] = []
    index = 0
    for archive in archives:
        try:
            archive_projects, archive_warnings, index = collect_archive_projects(archive, OUTPUT, index)
            projects.extend(archive_projects)
            warnings.extend(archive_warnings)
        except (OSError, tarfile.TarError, zipfile.BadZipFile) as exc:
            warnings.append(f"无法读取 {archive.name}：{exc}")

    student_names = {author for project in projects for author in project["authors"] if author != "待补充"}
    work_count = sum(project["projectCount"] for project in projects)
    image_count = sum(1 for project in projects if project.get("cover"))
    manifest = {
        "generatedAt": "build-time",
        "archives": [archive.name for archive in archives],
        "stats": {
            "studentCount": len(student_names),
            "projectCount": len(projects),
            "workCount": work_count,
            "playableCount": sum(1 for project in projects if project.get("playable")),
            "coverCount": image_count,
        },
        "warnings": warnings,
        "projects": projects,
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(
        f"[student-works] {len(archives)} 个压缩包，{len(projects)} 个项目，"
        f"{work_count} 个可试玩页面，{image_count} 个封面。"
    )
    for warning in warnings:
        print(f"[student-works] warning: {warning}")


if __name__ == "__main__":
    main()
