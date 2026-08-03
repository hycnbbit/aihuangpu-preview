import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  X,
} from "lucide-react";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { deployPath } from "@/lib/deployPath";

type ActivityCategory = "青少年科创" | "成人学习" | "企业服务" | "校友与产业";

const categories = [
  "全部",
  "青少年科创",
  "成人学习",
  "企业服务",
  "校友与产业",
] as const;

type Activity = {
  id: number;
  tag: string;
  category: ActivityCategory;
  title: string;
  date: string;
  location: string;
  attendees: string;
  summary: string;
  highlights: string[];
  images: string[];
};

const officialMedia = "https://aihuangpu.ai/manus-storage/";

const activities: Activity[] = [
  {
    id: 8,
    tag: "战略合作",
    category: "企业服务",
    title: "AI 黄埔学院陕西省代理签约仪式",
    date: "2026年7月26日",
    location: "陕西西安",
    attendees: "AI 黄埔学院与合作伙伴代表",
    summary:
      "AI 黄埔学院陕西省代理签约仪式于 7 月 26 日举行。双方正式达成陕西省区域合作，将共同推动 AI 教育资源在当地落地，为更多学习者带来面向实践与创造的 AI 学习体验。",
    highlights: [
      "陕西省代理正式签约",
      "区域合作伙伴达成共识",
      "推动 AI 教育资源落地",
      "拓展本地化服务网络",
    ],
    images: [
      officialMedia + "shaanxi-agency-signing-2026-signing-photo_03bf5dee.jpg",
    ],
  },
  {
    id: 7,
    tag: "青少年 AI 黑客松",
    category: "青少年科创",
    title: "AI 黄埔学院青少年黑客松 · 西安站",
    date: "2026年7月25日",
    location: "陕西西安",
    attendees: "青少年创作者同场实践",
    summary:
      "AI 黄埔学院青少年黑客松西安站于 7 月 25 日举行。学员围绕真实创意完成从需求拆解、AI 工具协作到现场展示的实践流程，在一日实战营中把想法转化为可演示的数字作品。",
    highlights: [
      "一日 AI 实战营",
      "AI 工具协作创作",
      "分组完成作品开发",
      "现场展示与结营表彰",
    ],
    images: [
      officialMedia + "xian-youth-ai-hackathon-2026-group-photo_1f08ef82.jpg",
      officialMedia + "xian-youth-ai-hackathon-2026-mentor_d01977fc.jpg",
      officialMedia + "xian-youth-ai-hackathon-2026-classroom_054152df.jpg",
      officialMedia + "xian-youth-ai-hackathon-2026-student-1_d866726a.jpg",
      officialMedia + "xian-youth-ai-hackathon-2026-student-2_8d0edea3.jpg",
      officialMedia + "xian-youth-ai-hackathon-2026-classroom-2_18ba9e4a.jpg",
    ],
  },
  {
    id: 6,
    tag: "香港黑客松",
    category: "青少年科创",
    title: "第二期香港青少年 AI 黑客松",
    date: "2026年7月18日",
    location: "香港 · 天后 CAI 大厦",
    attendees: "青少年创作者同场实践",
    summary:
      "第二期香港青少年 AI 黑客松在天后 CAI 大厦举行。学员在导师带领下围绕真实创意开展分组创作，从明确需求、协作开发到现场展示，完成了一次面向作品的 AI 实践挑战。",
    highlights: [
      "分组开展 AI 创作",
      "导师现场项目指导",
      "学生作品展示与分享",
      "结营颁发纪念证书",
    ],
    images: [
      officialMedia +
        "hong-kong-youth-ai-hackathon-2026-phase-2-group-photo_78d40780.jpg",
      officialMedia +
        "hong-kong-youth-ai-hackathon-2026-phase-2-workshop_78850bba.jpg",
      officialMedia +
        "hong-kong-youth-ai-hackathon-2026-phase-2-presentation_5d960b5f.jpg",
      officialMedia +
        "hong-kong-youth-ai-hackathon-2026-phase-2-stage_46b17c71.jpg",
    ],
  },
  {
    id: 5,
    tag: "青少年 AI 黑客松",
    category: "青少年科创",
    title: "晋阳星途 · 青少年 AI 黑客松",
    date: "2026年7月11日–12日",
    location: "山西太原 · 山西文旅大厦",
    attendees: "8–16 岁青少年参与",
    summary:
      "AI 黄埔学院携手山西文旅，带领 8 至 16 岁青少年从认识 AI、描述想法开始，借助 Work Buddy 完成软件创作与作品路演。两天里，孩子们把山西文旅、传统文化、学习与游戏等灵感做成了真实可运行的数字作品。",
    highlights: [
      "两天完成 AI 创作挑战",
      "Work Buddy 软件创作",
      "作品现场路演",
      "《晋楹记》获第一名",
    ],
    images: [
      officialMedia + "jinyang-xingtu-2026-group-photo_74c5c629.png",
      officialMedia + "jinyang-xingtu-2026-workshop-1_19f0042b.png",
      officialMedia + "jinyang-xingtu-2026-workshop-2_f3b39f49.png",
      officialMedia + "jinyang-xingtu-2026-awards_2a6da3d4.png",
    ],
  },
  {
    id: 4,
    tag: "香港黑客松",
    category: "青少年科创",
    title: "首期香港青少年 AI 黑客松",
    date: "7月4日",
    location: "香港 · 天后 CAI 大厦",
    attendees: "香港、深圳、韩国多地青少年参与",
    summary:
      "由 AI 黄埔学院主办的首期香港青少年 AI 黑客松在天后 CAI 大厦举行。来自香港、深圳、韩国的青少年在导师指导下完成作品，并全部登台进行项目路演。",
    highlights: [
      "多地青少年同场创作",
      "导师全程项目指导",
      "全员完成项目路演",
      "第二期于 7 月 18 日举行",
    ],
    images: [officialMedia + "hong-kong-youth-ai-hackathon-2026_25f29e55.jpg"],
  },
  {
    id: 3,
    tag: "SSA 2026",
    category: "校友与产业",
    title: "2026 亚洲智能传感器与应用技术博览会 AI 分论坛",
    date: "2026年6月24日–26日",
    location: "深圳会展中心（福田）",
    attendees: "全球 300+ 企业参展",
    summary:
      "2026 亚洲智能传感器与应用技术博览会在深圳会展中心举行。AI 黄埔学院作为协办方组织了 25 日下午的 AI 分论坛，进行了主题演讲和圆桌论坛。",
    highlights: [
      "10000+ 平方米展览面积",
      "全球 300+ 企业参展",
      "AI 分论坛主题演讲",
      "圆桌论坛",
    ],
    images: [officialMedia + "activity-ssa-2026-forum_d204f656.jpg"],
  },
  {
    id: 2,
    tag: "太原站",
    category: "成人学习",
    title: "AI 黄埔学院 · 太原站",
    date: "2026年5月30日",
    location: "山西太原 · 文旅大厦",
    attendees: "参与人数 50+ 人",
    summary:
      "两天高强度线下实操课，从认知提升到行业投资逻辑、从提示词实操到 VibeCoding 实战项目，多位导师结合实际项目与学员深度互动。",
    highlights: [
      "多位导师手把手教学",
      "提示词实操训练",
      "VibeCoding 实战项目",
      "学员现场交流",
    ],
    images: [officialMedia + "activity-taiyuan_b0f43bd3.webp"],
  },
  {
    id: 1,
    tag: "OpenClaw 中国行",
    category: "校友与产业",
    title: "OpenClaw Web4.0 中国行 · 太原站",
    date: "2026年3月29日",
    location: "山西太原 · 超自然数字文化中心",
    attendees: "参与人数 400+ 人",
    summary: "OpenClaw 太原站聚焦 Web4.0 新机遇，现场围绕相关主题展开交流。",
    highlights: [
      "400 人齐聚一堂",
      "聚焦 Web4.0 新机遇",
      "现场座无虚席",
      "主题交流",
    ],
    images: [officialMedia + "activity-openclaw-taiyuan_2da526f3.jpg"],
  },
];

function ActivityVisual({
  activity,
  onOpen,
}: {
  activity: Activity;
  onOpen: (images: string[], index: number) => void;
}) {
  const [activeImage, setActiveImage] = useState(0);
  const [failed, setFailed] = useState(false);
  const image = activity.images[activeImage];
  const showImage = Boolean(image) && !failed;

  return (
    <div className="relative min-h-[270px] overflow-hidden">
      <button
        type="button"
        onClick={() => showImage && onOpen(activity.images, activeImage)}
        className="relative block min-h-[270px] w-full overflow-hidden text-left"
        aria-label={
          showImage
            ? `查看${activity.title}活动图片`
            : `${activity.title}活动记录`
        }
      >
        {showImage ? (
          <img
            src={image}
            alt={activity.title}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        ) : (
          <div className="absolute inset-0 flex flex-col justify-between bg-[radial-gradient(circle_at_75%_18%,rgba(120,214,196,.28),transparent_24%),linear-gradient(135deg,#183c43,#09161d)] p-6 text-[#f7f1e5]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#78d6c4]">
              field note / {activity.tag}
            </span>
            <span className="max-w-sm text-2xl font-semibold leading-tight">
              {activity.title}
            </span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07151d] via-transparent to-transparent" />
        <div className="absolute left-6 top-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-[#ffb84d] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#07151d]">
            {activity.tag}
          </span>
          <span className="rounded-full border border-white/25 bg-[#07151d]/45 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75 backdrop-blur">
            {activity.category}
          </span>
        </div>
        <div className="absolute bottom-6 left-6 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/65">
          {showImage ? "查看现场照片" : "活动记录"}
          <ArrowUpRight className="h-3.5 w-3.5" />
        </div>
      </button>

      {activity.images.length > 1 && (
        <div className="absolute bottom-5 right-5 z-10 flex items-center gap-1.5 rounded-full border border-white/15 bg-[#07151d]/60 p-1.5 backdrop-blur">
          {activity.images.slice(0, 3).map((thumbnail, index) => (
            <button
              key={thumbnail}
              type="button"
              onClick={() => {
                setFailed(false);
                setActiveImage(index);
              }}
              aria-label={`查看第 ${index + 1} 张现场照片`}
              className={`h-9 w-9 overflow-hidden rounded-full border transition ${
                index === activeImage
                  ? "border-[#78d6c4]"
                  : "border-white/20 opacity-65 hover:opacity-100"
              }`}
            >
              <img
                src={thumbnail}
                alt=""
                className="h-full w-full object-cover"
              />
            </button>
          ))}
          {activity.images.length > 3 && (
            <span className="pr-1 font-mono text-[10px] text-white/70">
              +{activity.images.length - 3}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
};

export default function Activities() {
  const [lightbox, setLightbox] = useState<{
    images: string[];
    index: number;
  } | null>(null);
  const [activeCategory, setActiveCategory] =
    useState<(typeof categories)[number]>("全部");

  const filteredActivities = useMemo(
    () =>
      activeCategory === "全部"
        ? activities
        : activities.filter(activity => activity.category === activeCategory),
    [activeCategory]
  );

  return (
    <div className="min-h-screen bg-[#0b1c24] text-[#f7f1e5]">
      <Navbar tone="dark" />
      <header className="relative overflow-hidden border-b border-white/10 pt-28">
        <div className="absolute right-[-7rem] top-20 h-96 w-96 rounded-full border border-[#ffb84d]/20" />
        <div className="mx-auto max-w-[1440px] px-5 pb-20 sm:px-8 sm:pb-28 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            <Link href="/" className="transition hover:text-white">
              AI 黄埔学院
            </Link>
            <span>/</span>
            <span>学习生态</span>
            <span>/</span>
            <span className="text-[#78d6c4]">活动记录</span>
          </div>
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <motion.div
            {...reveal}
            className="relative z-10 grid gap-12 lg:grid-cols-[1fr_.65fr] lg:items-end"
          >
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#78d6c4]">
                <span className="h-px w-10 bg-[#78d6c4]" />
                AI HUANGPU / FIELD NOTES
              </div>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[.88] tracking-[-0.09em] sm:text-8xl">
                每一次相聚，
                <br />
                <span className="text-[#ff806e]">都是成长的现场。</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
                从峰会到工作坊，从城市课堂到作品路演，AI
                黄埔学院用一场场活动连接人才与机遇，也留下每一次实践与创造的现场记录。
              </p>
            </div>
            <div className="grid grid-cols-2 gap-y-6 border-t border-white/15 pt-5 sm:grid-cols-4 lg:border-t-0 lg:border-l lg:pl-8">
              <div>
                <div className="font-mono text-3xl font-bold text-[#78d6c4]">
                  20+
                </div>
                <div className="mt-2 text-xs text-white/40">年度活动</div>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-3xl font-bold text-[#ffb84d]">
                  5000+
                </div>
                <div className="mt-2 text-xs text-white/40">参与人次</div>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-3xl font-bold text-[#ff806e]">
                  30+
                </div>
                <div className="mt-2 text-xs text-white/40">合作企业</div>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-3xl font-bold text-[#f7f1e5]">
                  全国
                </div>
                <div className="mt-2 text-xs text-white/40">城市覆盖</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-14 sm:px-8 sm:py-24 lg:px-12">
        <div
          className="mb-10 flex flex-wrap gap-2 border-b border-white/12 pb-6"
          role="tablist"
          aria-label="活动类型筛选"
        >
          {categories.map(category => (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={activeCategory === category}
              onClick={() => setActiveCategory(category)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                activeCategory === category
                  ? "border-[#78d6c4] bg-[#78d6c4] text-[#07151d]"
                  : "border-white/15 text-white/55 hover:border-white/45 hover:text-white"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {filteredActivities.map((activity, index) => (
            <motion.article
              {...reveal}
              transition={{ ...reveal.transition, delay: index * 0.04 }}
              key={activity.id}
              className="group grid overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#10232b] lg:grid-cols-[.95fr_1.05fr]"
            >
              <div className={`relative ${index % 2 ? "lg:order-2" : ""}`}>
                <ActivityVisual
                  activity={activity}
                  onOpen={(images, index) => setLightbox({ images, index })}
                />
              </div>
              <div
                className={`flex flex-col justify-center p-7 sm:p-10 lg:p-12 ${index % 2 ? "lg:order-1" : ""}`}
              >
                <h2 className="max-w-xl text-2xl font-semibold leading-tight tracking-[-0.04em] sm:text-3xl">
                  {activity.title}
                </h2>
                <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/45">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-[#78d6c4]" />
                    {activity.date}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-[#78d6c4]" />
                    {activity.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-[#78d6c4]" />
                    {activity.attendees}
                  </span>
                </div>
                <p className="mt-6 text-sm leading-7 text-white/55">
                  {activity.summary}
                </p>
                <div className="mt-7 grid gap-2 sm:grid-cols-3">
                  {activity.highlights.map(highlight => (
                    <span
                      key={highlight}
                      className="border-t border-white/12 pt-2 text-xs text-white/50"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </main>

      <section className="border-t border-white/10 bg-[#d7eee6] text-[#123f3e]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:flex-row lg:items-end lg:px-12">
          <div>
            <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#277771]">
              NEXT / YOUR TURN
            </div>
            <h2 className="max-w-2xl text-4xl font-semibold leading-none tracking-[-0.07em] sm:text-6xl">
              下一场活动，
              <br />
              <span className="text-[#f07d63]">期待你的参与。</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/showcase"
              className="inline-flex items-center gap-2 rounded-full bg-[#123f3e] px-5 py-3 text-sm font-bold text-[#f6f1e7] transition hover:-translate-y-1"
            >
              看学生成果 <ArrowUpRight className="h-4 w-4" />
            </Link>
            <a
              href={deployPath("/#contact")}
              className="inline-flex items-center gap-2 rounded-full border border-[#123f3e]/25 px-5 py-3 text-sm font-bold transition hover:border-[#123f3e]/60"
            >
              预约咨询
            </a>
          </div>
        </div>
      </section>

      <Footer />
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#07151d]/95 p-5 backdrop-blur"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            aria-label="关闭图片"
            onClick={() => setLightbox(null)}
            className="absolute right-5 top-5 rounded-full border border-white/20 p-2 text-white/70 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
          {lightbox.images.length > 1 && (
            <>
              <button
                type="button"
                aria-label="上一张图片"
                onClick={event => {
                  event.stopPropagation();
                  setLightbox(current =>
                    current
                      ? {
                          ...current,
                          index:
                            (current.index - 1 + current.images.length) %
                            current.images.length,
                        }
                      : current
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#07151d]/60 p-3 text-white transition hover:border-white/60 sm:left-8"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                aria-label="下一张图片"
                onClick={event => {
                  event.stopPropagation();
                  setLightbox(current =>
                    current
                      ? {
                          ...current,
                          index: (current.index + 1) % current.images.length,
                        }
                      : current
                  );
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-[#07151d]/60 p-3 text-white transition hover:border-white/60 sm:right-8"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div
            className="relative max-h-[88vh] max-w-full"
            onClick={event => event.stopPropagation()}
          >
            <img
              src={lightbox.images[lightbox.index]}
              alt={`活动现场照片 ${lightbox.index + 1}`}
              className="max-h-[88vh] max-w-full rounded-xl object-contain"
            />
            {lightbox.images.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-[#07151d]/75 px-3 py-1 font-mono text-[10px] tracking-[0.16em] text-white/80">
                {String(lightbox.index + 1).padStart(2, "0")} /{" "}
                {String(lightbox.images.length).padStart(2, "0")}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
