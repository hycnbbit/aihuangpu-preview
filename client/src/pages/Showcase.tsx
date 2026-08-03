import { ArrowLeft, ArrowUpRight, Search, Sparkles } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudentWorkCard from "@/components/StudentWorkCard";
import { useStudentWorks } from "@/lib/studentWorks";

const FILTERS = ["全部", "互动游戏", "学习工具", "文化与公益", "创意体验"];

export default function Showcase() {
  const { manifest, loading } = useStudentWorks();
  const [activeFilter, setActiveFilter] = useState("全部");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return manifest.projects.filter(project => {
      const matchesFilter =
        activeFilter === "全部" || project.category === activeFilter;
      const searchable =
        `${project.title} ${project.authorLabel} ${project.description} ${project.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!normalized || searchable.includes(normalized));
    });
  }, [activeFilter, manifest.projects, query]);

  return (
    <div className="min-h-screen bg-[#0b1c24] text-[#f7f1e5]">
      <Navbar tone="dark" />
      <header className="relative overflow-hidden border-b border-white/10 pt-28">
        <div className="absolute -right-28 top-16 h-96 w-96 rounded-full border border-[#78d6c4]/20" />
        <div className="absolute right-24 top-32 h-4 w-4 rounded-full bg-[#ffb84d] shadow-[0_0_0_12px_rgba(255,184,77,.12)]" />
        <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
          <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
            <Link href="/" className="transition hover:text-white">
              AI 黄埔学院
            </Link>
            <span>/</span>
            <span>青少年 AI 科创</span>
            <span>/</span>
            <span className="text-[#78d6c4]">学生作品展</span>
          </div>
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="relative z-10 grid gap-10 lg:grid-cols-[1fr_.62fr] lg:items-end"
          >
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#78d6c4]">
                <Sparkles className="h-3.5 w-3.5" />
                AI HUANGPU / WORK ARCHIVE
              </div>
              <h1 className="max-w-4xl text-6xl font-semibold leading-[.88] tracking-[-0.09em] sm:text-8xl">
                打开他们的
                <br />
                <span className="text-[#ffb84d]">第一次作品。</span>
              </h1>
              <p className="mt-8 max-w-xl text-base leading-7 text-white/55 sm:text-lg">
                这是 AI 黄埔学院青少年 AI
                科创业务线的成果展示。这里不是截图集，而是可以直接试玩的作品档案；学院同时服务成人学习者、管理者与企业客户。
              </p>
            </div>
            <div className="grid grid-cols-3 border-t border-white/15 pt-5 lg:border-t-0 lg:border-l lg:pl-8">
              <div>
                <div className="font-mono text-3xl font-bold tracking-[-0.06em] text-[#78d6c4]">
                  {manifest.stats.workCount || "—"}
                </div>
                <div className="mt-2 text-xs text-white/40">可试玩入口</div>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-3xl font-bold tracking-[-0.06em] text-[#ffb84d]">
                  {manifest.stats.studentCount || "—"}
                </div>
                <div className="mt-2 text-xs text-white/40">创作者</div>
              </div>
              <div className="border-l border-white/15 pl-4">
                <div className="font-mono text-3xl font-bold tracking-[-0.06em] text-[#ff806e]">
                  {manifest.stats.projectCount || "—"}
                </div>
                <div className="mt-2 text-xs text-white/40">项目档案</div>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-10 flex flex-col gap-5 border-b border-white/12 pb-6 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-2"
            role="tablist"
            aria-label="作品分类"
          >
            {FILTERS.map(filter => (
              <button
                type="button"
                key={filter}
                role="tab"
                aria-selected={activeFilter === filter}
                onClick={() => setActiveFilter(filter)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition ${activeFilter === filter ? "border-[#78d6c4] bg-[#78d6c4] text-[#07151d]" : "border-white/15 text-white/55 hover:border-white/45 hover:text-white"}`}
              >
                {filter}
              </button>
            ))}
          </div>
          <label className="flex w-full items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5 text-sm text-white/55 focus-within:border-[#78d6c4]/70 lg:max-w-xs">
            <Search className="h-4 w-4 shrink-0" />
            <span className="sr-only">搜索作品</span>
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              placeholder="搜索作品、作者或关键词"
              className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/30"
            />
          </label>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-[.9] animate-pulse rounded-[1.5rem] bg-white/[0.06]"
              />
            ))}
          </div>
        ) : filtered.length > 0 ? (
          <motion.div
            layout
            className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((work, index) => (
                <StudentWorkCard key={work.id} work={work} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-[1.5rem] border border-dashed border-white/20 px-6 text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 text-[#78d6c4]">
              <Search className="h-5 w-5" />
            </div>
            <h2 className="text-xl font-semibold">没有找到匹配的作品</h2>
            <p className="mt-2 text-sm text-white/45">
              换一个关键词，或者回到全部分类继续浏览。
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setActiveFilter("全部");
              }}
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#ffb84d]"
            >
              清空筛选 <ArrowUpRight className="h-4 w-4" />
            </button>
          </div>
        )}

        <div className="mt-16 flex flex-col justify-between gap-5 border-t border-white/12 pt-6 text-sm text-white/40 sm:flex-row sm:items-center">
          <p>所有入口均由作品压缩包自动扫描、整理并生成。</p>
          <Link
            href="/activities"
            className="inline-flex items-center gap-2 font-bold text-[#78d6c4] transition hover:text-[#b9eee2]"
          >
            了解活动背景 <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}
