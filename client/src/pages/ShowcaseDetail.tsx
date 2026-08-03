import {
  ArrowLeft,
  ArrowUpRight,
  Maximize2,
  Play,
  Sparkles,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import {
  findStudentWork,
  useStudentWorks,
  type StudentWork,
} from "@/lib/studentWorks";

function MissingWork() {
  return (
    <div className="min-h-screen bg-[#0b1c24] text-[#f7f1e5]">
      <Navbar tone="dark" />
      <main className="mx-auto flex min-h-[75vh] max-w-[1440px] flex-col items-start justify-center px-5 pt-20 sm:px-8 lg:px-12">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-[#78d6c4]">
          404 / PROJECT NOT FOUND
        </p>
        <h1 className="mt-5 max-w-xl text-5xl font-semibold leading-none tracking-[-0.07em]">
          这个作品暂时
          <br />
          <span className="text-[#ffb84d]">还没有被找到。</span>
        </h1>
        <Link
          href="/showcase"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#ffb84d] px-5 py-3 text-sm font-bold text-[#07151d]"
        >
          <ArrowLeft className="h-4 w-4" /> 返回作品展
        </Link>
      </main>
      <Footer />
    </div>
  );
}

function ProjectCover({ work }: { work: StudentWork }) {
  return (
    <div className="relative overflow-hidden rounded-[1.75rem] border border-white/15 bg-[#10232b] shadow-[0_30px_90px_rgba(0,0,0,.2)]">
      <div className="aspect-[1.12]">
        {work.cover ? (
          <img
            src={work.cover}
            alt={`${work.title} 封面`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full flex-col justify-between p-7 text-[#f7f1e5]">
            <span
              className="font-mono text-xs uppercase tracking-[0.22em]"
              style={{ color: work.accent }}
            >
              playable project
            </span>
            <span className="text-4xl font-semibold leading-none">
              {work.title}
            </span>
          </div>
        )}
      </div>
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-[#07151d] to-transparent p-6 pt-24">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/55">
          {work.category}
        </span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ backgroundColor: work.accent, color: "#07151d" }}
        >
          <Play className="h-4 w-4 fill-current" />
        </span>
      </div>
    </div>
  );
}

export default function ShowcaseDetail() {
  const [, params] = useRoute("/showcase/:slug");
  const { manifest, loading } = useStudentWorks();
  const [selectedWorkId, setSelectedWorkId] = useState<string | null>(null);
  const project = params?.slug
    ? findStudentWork(manifest, params.slug)
    : undefined;
  const selectedWork =
    project?.works.find(item => item.id === selectedWorkId) ??
    project?.works[0];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    setSelectedWorkId(null);
  }, [params?.slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0b1c24] font-mono text-xs uppercase tracking-[0.2em] text-[#78d6c4]">
        loading project…
      </div>
    );
  }

  if (!project || !selectedWork) return <MissingWork />;

  return (
    <div className="min-h-screen bg-[#0b1c24] text-[#f7f1e5]">
      <Navbar tone="dark" />
      <main>
        <section className="relative overflow-hidden border-b border-white/10 pt-28">
          <div className="absolute -right-40 top-24 h-[34rem] w-[34rem] rounded-full border border-[#78d6c4]/15" />
          <div className="mx-auto max-w-[1440px] px-5 pb-16 sm:px-8 sm:pb-24 lg:px-12">
            <div className="mb-6 flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
              <Link href="/" className="transition hover:text-white">
                AI 黄埔学院
              </Link>
              <span>/</span>
              <span>青少年 AI 科创</span>
              <span>/</span>
              <Link
                href="/showcase"
                className="text-[#78d6c4] transition hover:text-white"
              >
                学生作品展
              </Link>
            </div>
            <Link
              href="/showcase"
              className="mb-10 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-white/45 transition hover:text-white"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All works
            </Link>
            <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-end lg:gap-20">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              >
                <div
                  className="mb-5 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em]"
                  style={{ color: project.accent }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  {project.category} / PROJECT {project.id.replace("work-", "")}
                </div>
                <h1 className="max-w-3xl text-6xl font-semibold leading-[.88] tracking-[-0.09em] sm:text-8xl">
                  {project.title}
                </h1>
                <p className="mt-8 max-w-xl text-base leading-7 text-white/58 sm:text-lg">
                  {project.description}
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-white/55">
                  <span className="inline-flex items-center gap-2">
                    <Users
                      className="h-4 w-4"
                      style={{ color: project.accent }}
                    />
                    {project.authorLabel}
                  </span>
                  <span className="h-4 w-px bg-white/20" />
                  <span>{project.projectCount} 个作品入口</span>
                </div>
                <div className="mt-7 flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span
                      key={tag}
                      className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/55"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.1,
                  duration: 0.7,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <ProjectCover work={project} />
              </motion.div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-20 lg:px-12">
          <div className="mb-5 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#78d6c4]">
                <span className="h-px w-8 bg-[#78d6c4]" />
                TRY IT OUT
              </div>
              <h2 className="text-3xl font-semibold tracking-[-0.05em] sm:text-4xl">
                在线试玩
              </h2>
            </div>
            <p className="max-w-sm text-right text-xs leading-5 text-white/35 sm:text-sm">
              作品运行在独立沙盒中。遇到需要全屏、声音或鼠标锁定的项目，可以打开新窗口体验。
            </p>
          </div>

          {project.works.length > 1 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {project.works.map((work, index) => (
                <button
                  type="button"
                  key={work.id}
                  onClick={() => setSelectedWorkId(work.id)}
                  className={`rounded-full border px-4 py-2 text-xs font-bold transition ${selectedWork.id === work.id ? "border-[#78d6c4] bg-[#78d6c4] text-[#07151d]" : "border-white/15 text-white/50 hover:border-white/45 hover:text-white"}`}
                >
                  0{index + 1} / {work.title}
                </button>
              ))}
            </div>
          )}

          <div className="overflow-hidden rounded-[1.5rem] border border-white/15 bg-[#07151d] shadow-[0_30px_100px_rgba(0,0,0,.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff806e]" />
                <span className="h-2 w-2 rounded-full bg-[#ffb84d]" />
                <span className="h-2 w-2 rounded-full bg-[#78d6c4]" />
                <span className="ml-3 truncate font-mono text-[10px] text-white/35">
                  {selectedWork.entry}
                </span>
              </div>
              <a
                href={selectedWork.entry}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.15em] text-white/60 transition hover:border-[#78d6c4] hover:text-[#78d6c4]"
              >
                新窗口打开 <Maximize2 className="h-3 w-3" />
              </a>
            </div>
            <div className="bg-[#f7f1e5] p-2 sm:p-3">
              <iframe
                key={selectedWork.entry}
                title={`${project.title} - ${selectedWork.title}`}
                src={selectedWork.entry}
                loading="lazy"
                allow="autoplay; fullscreen"
                sandbox="allow-forms allow-modals allow-pointer-lock allow-popups allow-scripts"
                className="h-[72vh] min-h-[480px] w-full rounded-lg border-0 bg-white"
              />
            </div>
          </div>
        </section>

        <section className="border-t border-white/10 bg-[#d7eee6] text-[#123f3e]">
          <div className="mx-auto grid max-w-[1440px] gap-12 px-5 py-16 sm:px-8 sm:py-24 lg:grid-cols-[.7fr_1.3fr] lg:gap-24 lg:px-12">
            <div>
              <div className="mb-4 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#277771]">
                <span className="h-px w-8 bg-[#277771]" />
                THE MAKERS
              </div>
              <h2 className="text-4xl font-semibold leading-none tracking-[-0.07em] sm:text-5xl">
                作者与
                <br />
                <span className="text-[#f07d63]">灵感来源。</span>
              </h2>
            </div>
            <div>
              <p className="max-w-2xl text-lg leading-8 text-[#123f3e]/70">
                这件作品由 {project.authorLabel}{" "}
                完成。我们保留作品的原始入口，也保留它在黑客松里最重要的状态：还在生长、还可以继续被改进。
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {project.authors.map(author => (
                  <span
                    key={author}
                    className="rounded-full border border-[#123f3e]/20 px-4 py-2 text-sm font-bold"
                  >
                    {author}
                  </span>
                ))}
              </div>
              <Link
                href="/showcase"
                className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#277771] transition hover:text-[#f07d63]"
              >
                继续浏览其他作品 <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
