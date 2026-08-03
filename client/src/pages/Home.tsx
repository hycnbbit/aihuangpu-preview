import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  ChevronRight,
  Code2,
  Compass,
  Cpu,
  GraduationCap,
  Lightbulb,
  Mail,
  MapPin,
  Network,
  Rocket,
  Users,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useMemo } from "react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import StudentWorkCard from "@/components/StudentWorkCard";
import FloatingCTA from "@/components/FloatingCTA";
import { useStudentWorks, type StudentWork } from "@/lib/studentWorks";

const paths = [
  {
    index: "01",
    title: "小白入门",
    audience: "AI 小白与成人学习者",
    problem: "不知道从哪开始，学了很多碎片知识却没有结果。",
    method: "AI 通识 + 常用工具实操 + 第一个真实项目",
    result: "看得懂 AI，会用工具，完成一个可展示成果。",
    accent: "#78d6c4",
    layout: "lg:col-span-2",
    cta: { label: "从入门开始", href: "#contact" },
  },
  {
    index: "02",
    title: "职场提升",
    audience: "希望提效的职场人士",
    problem: "工作重复、内容生产慢、数据处理和分析依赖人工。",
    method: "岗位场景训练 + 办公 / 内容 / 数据实战",
    result: "把 AI 变成日常工作流，形成可复用的岗位方法。",
    accent: "#ffb84d",
    layout: "lg:col-span-2",
    cta: { label: "提升岗位效率", href: "#contact" },
  },
  {
    index: "03",
    title: "企业家 / 管理者",
    audience: "关注战略与组织升级的管理者",
    problem: "知道 AI 重要，但难以判断优先级、投入和落地路径。",
    method: "战略研讨 + 场景识别 + 组织转型路线图",
    result: "明确 AI 机会、风险、试点顺序和组织能力建设方式。",
    accent: "#ff806e",
    layout: "lg:col-span-2",
    cta: { label: "规划转型路径", href: "#enterprise" },
  },
  {
    index: "04",
    title: "企业培训与定制服务",
    audience: "需要团队能力建设的企业客户",
    problem: "工具很多、业务复杂，通用课程很难直接解决真实问题。",
    method: "AI 通识培训、管理层工作坊、业务场景共创与定制课程。",
    result: "形成贴合业务的课程、训练计划和后续服务机制。",
    accent: "#b7a4ff",
    layout: "lg:col-span-3",
    cta: { label: "了解企业服务", href: "#enterprise" },
    emphasis: true,
  },
  {
    index: "05",
    title: "青少年 AI 科创",
    audience: "青少年与家长",
    problem: "希望提升 AI 素养，而不是停留在科普和听课。",
    method: "创意编程、项目制学习、黑客松、作品发布与路演。",
    result: "把兴趣变成作品，把作品带到真实观众面前。",
    accent: "#78d6c4",
    layout: "lg:col-span-3",
    cta: { label: "查看学生作品", href: "/showcase" },
    emphasis: true,
  },
];

const methodSteps = [
  {
    icon: Compass,
    title: "明确真实目标",
    desc: "先弄清个人、组织或孩子真正要解决的问题。",
  },
  {
    icon: Lightbulb,
    title: "选择合适路径",
    desc: "按人群、基础、场景和投入方式匹配学习路径。",
  },
  {
    icon: Code2,
    title: "边学边做项目",
    desc: "工具、方法和真实任务同步推进，不停留在概念。",
  },
  {
    icon: Cpu,
    title: "复盘与迭代",
    desc: "导师反馈、场景验证和持续优化形成学习闭环。",
  },
  {
    icon: Rocket,
    title: "交付可见成果",
    desc: "课程、工作坊或黑客松都以可展示的结果收尾。",
  },
];

const enterpriseServices = [
  {
    title: "企业 AI 通识与岗位培训",
    desc: "围绕不同岗位建立统一认知，减少工具碎片化学习带来的低效。",
  },
  {
    title: "管理层 AI 战略工作坊",
    desc: "帮助管理层理解机会、边界、投入方式与组织转型的优先级。",
  },
  {
    title: "业务场景共创与实操",
    desc: "从真实业务流程出发，识别适合 AI 介入的场景并完成实操验证。",
  },
  {
    title: "定制课程与人才培养",
    desc: "根据团队基础与业务目标配置课程、训练方式与后续服务节奏。",
  },
];

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.18 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
};

function HeroOutcomeCard({ work }: { work?: StudentWork }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.38, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-[1.4rem] border border-[#123f3e]/12 bg-[#10232b] text-[#f7f1e5] shadow-[0_25px_80px_rgba(18,63,62,.18)]"
    >
      {work?.cover && (
        <img
          src={work.cover}
          alt={`${work.title} 作品封面`}
          loading="eager"
          decoding="async"
          className="h-44 w-full object-cover opacity-90"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07151d] via-[#07151d]/35 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#78d6c4]">
            Youth outcome / 成果样本
          </div>
          <div className="mt-2 max-w-sm text-xl font-semibold tracking-[-0.03em]">
            {work?.title ?? "学生作品正在整理"}
          </div>
        </div>
        <Link
          href={work ? `/showcase/${work.slug}` : "/showcase"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#ffb84d] text-[#07151d] transition hover:-translate-y-1"
          aria-label="查看学生作品"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </motion.div>
  );
}

function PathCard({
  path,
  index,
}: {
  path: (typeof paths)[number];
  index: number;
}) {
  const isHash = path.cta.href.startsWith("#");
  const content = (
    <>
      <div className="mb-6 flex items-start justify-between gap-4">
        <span className="font-mono text-xs text-[#123f3e]/35">
          {path.index}
        </span>
        <span
          className="h-2.5 w-2.5 rounded-full"
          style={{ backgroundColor: path.accent }}
        />
      </div>
      <h3 className="text-2xl font-semibold tracking-[-0.04em] text-[#123f3e]">
        {path.title}
      </h3>
      <p className="mt-2 text-sm font-medium text-[#123f3e]/55">
        {path.audience}
      </p>
      <div
        className={`mt-7 grid gap-5 ${path.emphasis ? "sm:grid-cols-2" : ""}`}
      >
        <div>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#123f3e]/35">
            要解决的问题
          </div>
          <p className="text-sm leading-6 text-[#123f3e]/65">{path.problem}</p>
        </div>
        <div>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#123f3e]/35">
            学习 / 服务方式
          </div>
          <p className="text-sm leading-6 text-[#123f3e]/65">{path.method}</p>
        </div>
        <div className={path.emphasis ? "sm:col-span-2" : ""}>
          <div className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#123f3e]/35">
            可以获得的结果
          </div>
          <p className="text-sm font-medium leading-6 text-[#123f3e]">
            {path.result}
          </p>
        </div>
      </div>
      <div
        className="mt-8 inline-flex items-center gap-2 text-sm font-bold"
        style={{ color: path.accent }}
      >
        {path.cta.label}
        <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
    </>
  );

  const className = `group relative overflow-hidden rounded-[1.35rem] border p-6 sm:p-7 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(18,63,62,.12)] ${path.layout} ${
    path.emphasis
      ? "border-[#123f3e]/20 bg-[#e9f2ec]"
      : "border-[#123f3e]/12 bg-white/45"
  }`;

  return (
    <motion.div
      {...reveal}
      transition={{ ...reveal.transition, delay: index * 0.06 }}
      className={className}
    >
      {isHash ? (
        <a href={path.cta.href}>{content}</a>
      ) : (
        <Link href={path.cta.href}>{content}</Link>
      )}
    </motion.div>
  );
}

export default function Home() {
  const { manifest, loading } = useStudentWorks();
  const { scrollYProgress } = useScroll();
  const heroPanelY = useTransform(scrollYProgress, [0, 0.2], [0, 60]);
  const projects = manifest.projects;
  const featuredWork = projects[0];
  const moreWorks = projects.slice(1, 3);
  const categoryCount = useMemo(
    () => new Set(projects.map(project => project.category)).size,
    [projects]
  );

  return (
    <div className="min-h-screen overflow-hidden bg-[#f6f1e7] text-[#123f3e]">
      <section
        id="hero"
        className="relative min-h-[100svh] overflow-hidden bg-[#f6f1e7]"
      >
        <div className="absolute right-0 top-0 hidden h-full w-[43%] bg-[#d7eee6] lg:block" />
        <div className="absolute -right-28 top-28 h-[28rem] w-[28rem] rounded-full border border-[#123f3e]/10" />
        <div className="absolute bottom-[14%] right-[24%] h-3 w-3 rounded-full bg-[#ff806e] shadow-[0_0_0_10px_rgba(255,128,110,.14)]" />
        <Navbar tone="light" />

        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-[1440px] items-center gap-12 px-5 pb-14 pt-28 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-16 lg:px-12 lg:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-3xl"
          >
            <div className="mb-7 flex flex-wrap items-center gap-3 font-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#277771]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#ff806e]" />
                AI HUANGPU ACADEMY
              </span>
              <span className="text-[#123f3e]/35">PRACTICAL AI EDUCATION</span>
            </div>
            <h1 className="text-[clamp(2.8rem,4vw,4.8rem)] font-semibold leading-[.98] tracking-[-0.075em] text-[#123f3e]">
              <span className="hidden sm:block">让每个人和每个组织，</span>
              <span className="hidden sm:block">
                都能把 <span className="text-[#f07d63]">AI</span> 用进真实世界。
              </span>
              <span className="sm:hidden">
                让每个人和
                <br />
                每个组织，
                <br />
                都能把 <span className="text-[#f07d63]">AI</span>
                <br />
                用进真实世界。
              </span>
            </h1>
            <p className="mt-8 max-w-2xl text-base leading-8 text-[#123f3e]/65 sm:text-lg">
              AI 黄埔学院是面向个人、管理者、企业和青少年的综合性 AI
              实战教育平台。我们把工具学习、真实项目和组织落地连接起来，帮助不同人群找到适合自己的
              AI 路径。
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <a
                href="#path"
                className="group inline-flex items-center gap-3 rounded-full bg-[#123f3e] px-6 py-3.5 text-sm font-bold text-[#f6f1e7] transition hover:-translate-y-1 hover:bg-[#1d5754]"
              >
                选择学习路径{" "}
                <ArrowDownRight className="h-4 w-4 transition group-hover:translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="#enterprise"
                className="inline-flex items-center gap-2 rounded-full border border-[#123f3e]/25 px-6 py-3.5 text-sm font-bold text-[#123f3e] transition hover:-translate-y-1 hover:border-[#123f3e]/60"
              >
                了解企业服务 <ChevronRight className="h-4 w-4" />
              </a>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-3 border-t border-[#123f3e]/15 pt-5">
              <div>
                <div className="font-mono text-2xl font-bold tracking-[-0.06em] text-[#123f3e]">
                  5
                </div>
                <div className="mt-1 text-xs text-[#123f3e]/50">
                  学习与服务路径
                </div>
              </div>
              <div className="border-l border-[#123f3e]/15 pl-5">
                <div className="font-mono text-2xl font-bold tracking-[-0.06em] text-[#123f3e]">
                  项目制
                </div>
                <div className="mt-1 text-xs text-[#123f3e]/50">
                  以真实成果为目标
                </div>
              </div>
              <div className="border-l border-[#123f3e]/15 pl-5">
                <div className="font-mono text-2xl font-bold tracking-[-0.06em] text-[#123f3e]">
                  场景化
                </div>
                <div className="mt-1 text-xs text-[#123f3e]/50">
                  连接个人与组织
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            style={{ y: heroPanelY }}
            className="relative mx-auto w-full max-w-[640px]"
          >
            <div className="absolute inset-[5%_0_8%_5%] rounded-[2rem] border border-[#123f3e]/10 bg-[#bfe5da]/50" />
            <motion.div
              initial={{ opacity: 0, y: 32, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: -2 }}
              transition={{
                delay: 0.18,
                duration: 0.75,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative z-10 rounded-[1.75rem] border border-[#123f3e]/15 bg-[#f8f3e8] p-5 shadow-[0_25px_80px_rgba(18,63,62,.16)] sm:p-7"
            >
              <div className="mb-6 flex items-center justify-between gap-4 border-b border-[#123f3e]/10 pb-5">
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#277771]">
                    SERVICE MAP
                  </div>
                  <div className="mt-2 text-2xl font-semibold tracking-[-0.04em]">
                    一张图看懂我们
                  </div>
                </div>
                <span className="rounded-full bg-[#123f3e] px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-[#f6f1e7]">
                  2026
                </span>
              </div>
              <div className="space-y-4">
                {[
                  {
                    icon: Users,
                    title: "个人成长",
                    desc: "入门、提效、岗位能力",
                    color: "#78d6c4",
                  },
                  {
                    icon: Building2,
                    title: "组织转型",
                    desc: "战略、培训、场景落地",
                    color: "#ffb84d",
                  },
                  {
                    icon: GraduationCap,
                    title: "青年创造",
                    desc: "科创、黑客松、作品发布",
                    color: "#ff806e",
                  },
                ].map(item => {
                  const Icon = item.icon;
                  return (
                    <div
                      key={item.title}
                      className="grid grid-cols-[3rem_1fr_auto] items-center gap-4 border-b border-[#123f3e]/10 pb-4 last:border-0 last:pb-0"
                    >
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{
                          backgroundColor: `${item.color}26`,
                          color: item.color,
                        }}
                      >
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <div className="font-semibold tracking-[-0.02em]">
                          {item.title}
                        </div>
                        <div className="mt-1 text-sm text-[#123f3e]/50">
                          {item.desc}
                        </div>
                      </div>
                      <ArrowUpRight className="h-4 w-4 text-[#123f3e]/30" />
                    </div>
                  );
                })}
              </div>
            </motion.div>
            <div className="relative z-20 ml-auto mt-[-2.2rem] w-[72%] rotate-2 sm:w-[64%]">
              <HeroOutcomeCard work={featuredWork} />
            </div>
          </motion.div>
        </div>
      </section>

      <section id="path" className="scroll-mt-16 bg-[#f6f1e7] py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <motion.div {...reveal} className="mb-14 max-w-4xl">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#277771]">
              <span className="h-px w-10 bg-[#277771]" />
              01 / CHOOSE YOUR PATH
            </div>
            <h2 className="text-4xl font-semibold leading-[.98] tracking-[-0.06em] sm:text-6xl">
              不从课程开始，
              <br />
              <span className="text-[#f07d63]">先从你是谁开始。</span>
            </h2>
            <p className="mt-7 max-w-2xl text-base leading-7 text-[#123f3e]/60">
              每一条路径都明确适合谁、解决什么、怎么学，以及最后能拿到什么结果。
            </p>
          </motion.div>
          <div className="grid gap-5 lg:grid-cols-6">
            {paths.map((path, index) => (
              <PathCard key={path.index} path={path} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section id="method" className="bg-[#d7eee6] py-24 sm:py-32">
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:gap-24 lg:px-12">
          <motion.div {...reveal}>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#277771]">
              <span className="h-px w-10 bg-[#277771]" />
              02 / HOW WE WORK
            </div>
            <h2 className="max-w-xl text-5xl font-semibold leading-[.95] tracking-[-0.08em] sm:text-7xl">
              实战，
              <br />
              <span className="text-[#f07d63]">不是口号。</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-8 text-[#123f3e]/65">
              无论面对的是职场任务、企业业务，还是孩子的第一个项目，AI
              黄埔学院都用同一套方法：真实目标、真实工具、真实反馈、真实成果。
            </p>
          </motion.div>
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.12 }}
            className="relative"
          >
            <div className="absolute bottom-0 left-5 top-0 w-px bg-[#123f3e]/18" />
            <div className="space-y-1">
              {methodSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.title}
                    className="group relative grid grid-cols-[3rem_1fr] gap-5 border-b border-[#123f3e]/12 py-6 first:pt-0 last:border-0"
                  >
                    <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border border-[#123f3e]/20 bg-[#d7eee6] transition group-hover:border-[#f07d63] group-hover:bg-[#f07d63] group-hover:text-white">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <h3 className="text-lg font-semibold tracking-[-0.03em]">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm text-[#123f3e]/55">
                          {step.desc}
                        </p>
                      </div>
                      <span className="font-mono text-xs text-[#123f3e]/35">
                        0{index + 1}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="enterprise"
        className="scroll-mt-16 bg-[#0b1c24] py-24 text-[#f7f1e5] sm:py-32"
      >
        <div className="mx-auto grid max-w-[1440px] gap-16 px-5 sm:px-8 lg:grid-cols-[.82fr_1.18fr] lg:gap-24 lg:px-12">
          <motion.div {...reveal}>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#ffb84d]">
              <span className="h-px w-10 bg-[#ffb84d]" />
              03 / FOR ORGANIZATIONS
            </div>
            <h2 className="max-w-xl text-5xl font-semibold leading-[.95] tracking-[-0.08em] sm:text-7xl">
              企业 AI 落地，
              <br />
              <span className="text-[#ffb84d]">先回到业务现场。</span>
            </h2>
            <p className="mt-8 max-w-lg text-base leading-8 text-white/55">
              我们为企业提供从认知、战略到业务实操和人才培养的完整服务结构。每个项目都从真实业务诊断开始，不默认套通用模板。
            </p>
            <div className="mt-9 border-t border-white/15 pt-6 text-sm leading-7 text-white/45">
              <p>
                服务方式、周期与课程组合均可按团队基础、业务场景和交付目标配置；真实案例与成果将根据已确认项目持续补充。
              </p>
            </div>
          </motion.div>
          <div className="grid gap-4 sm:grid-cols-2">
            {enterpriseServices.map((service, index) => (
              <motion.div
                key={service.title}
                {...reveal}
                transition={{ ...reveal.transition, delay: index * 0.06 }}
                className="border-t border-white/18 pt-6"
              >
                <div className="mb-8 flex items-start justify-between gap-4">
                  <span className="font-mono text-xs text-white/30">
                    0{index + 1}
                  </span>
                  <Building2 className="h-4 w-4 text-[#ffb84d]" />
                </div>
                <h3 className="text-xl font-semibold tracking-[-0.03em]">
                  {service.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/50">
                  {service.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="youth" className="scroll-mt-16 bg-[#f6f1e7] py-24 sm:py-32">
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <motion.div
            {...reveal}
            className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end"
          >
            <div>
              <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#277771]">
                <span className="h-px w-10 bg-[#277771]" />
                04 / YOUTH AI LAB
              </div>
              <h2 className="max-w-3xl text-4xl font-semibold leading-[.98] tracking-[-0.06em] sm:text-6xl">
                学生作品，
                <br />
                <span className="text-[#78d6c4]">是成果，不是全部。</span>
              </h2>
            </div>
            <div className="max-w-md text-sm leading-7 text-[#123f3e]/60">
              <p>
                这是 AI 黄埔学院青少年 AI
                科创业务线的成果展示。它体现我们的项目制学习能力，但学院同时服务成人、管理者和企业客户。
              </p>
              <div className="mt-5 flex flex-wrap gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#123f3e]/45">
                <span>
                  {loading ? "…" : manifest.stats.workCount} 个作品入口
                </span>
                <span>
                  {loading ? "…" : manifest.stats.studentCount} 位作者
                </span>
                <span>{categoryCount || "—"} 个创作方向</span>
              </div>
            </div>
          </motion.div>

          {featuredWork ? (
            <div className="grid gap-6 lg:grid-cols-[1.05fr_.95fr]">
              <motion.div
                {...reveal}
                className="group relative overflow-hidden rounded-[1.6rem] bg-[#10232b] shadow-[0_28px_80px_rgba(18,63,62,.16)]"
              >
                <Link href={`/showcase/${featuredWork.slug}`} className="block">
                  <div className="relative overflow-hidden bg-[#10232b]">
                    {featuredWork.cover && (
                      <img
                        src={featuredWork.cover}
                        alt={`${featuredWork.title} 封面`}
                        loading="eager"
                        decoding="async"
                        className="aspect-[1.28] w-full object-cover opacity-95 transition duration-700 group-hover:scale-[1.03]"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07151d]/25 via-transparent to-transparent" />
                  </div>
                  <div className="border-t border-white/10 bg-[#10232b] p-6 text-white sm:p-8">
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#78d6c4]">
                      Featured student work
                    </p>
                    <div className="flex items-end justify-between gap-5">
                      <div>
                        <h3 className="text-2xl font-semibold tracking-[-0.03em] sm:text-4xl">
                          {featuredWork.title}
                        </h3>
                        <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">
                          {featuredWork.description}
                        </p>
                      </div>
                      <span className="mb-1 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#ffb84d] text-[#07151d] transition group-hover:-translate-y-1">
                        <ArrowUpRight className="h-5 w-5" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
              <div className="grid gap-5 sm:grid-cols-2">
                {moreWorks.map((work, index) => (
                  <StudentWorkCard
                    key={work.id}
                    work={work}
                    index={index + 1}
                    compact
                  />
                ))}
                <motion.div
                  {...reveal}
                  transition={{ ...reveal.transition, delay: 0.18 }}
                  className="rounded-[1.25rem] border border-[#123f3e]/12 bg-[#e9f2ec] p-6 sm:col-span-2"
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#277771]">
                    YOUTH PROGRAM
                  </div>
                  <h3 className="mt-3 text-2xl font-semibold tracking-[-0.04em]">
                    创意编程、黑客松与作品发布
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#123f3e]/60">
                    孩子不是被动听课，而是在导师引导下提出问题、使用 AI
                    工具、完成作品并进行公开表达。
                  </p>
                  <Link
                    href="/showcase"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#277771]"
                  >
                    浏览完整作品展 <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-[#123f3e]/25 p-12 text-center text-[#123f3e]/55">
              学生作品正在整理，马上回来。
            </div>
          )}
        </div>
      </section>

      <section
        id="resources"
        className="bg-[#ffb84d] py-24 text-[#123f3e] sm:py-32"
      >
        <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
          <motion.div {...reveal} className="mb-12 max-w-3xl">
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#123f3e]/55">
              <span className="h-px w-10 bg-[#123f3e]/55" />
              05 / PEOPLE & CONNECTIONS
            </div>
            <h2 className="text-4xl font-semibold leading-[.98] tracking-[-0.06em] sm:text-6xl">
              导师、活动与产业资源，
              <br />
              共同构成学习生态。
            </h2>
          </motion.div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              {
                icon: Users,
                title: "名师团队",
                desc: "来自技术、产品、创业与产业实践的导师资源。",
                href: "/teachers",
                label: "查看师资",
              },
              {
                icon: Network,
                title: "活动记录",
                desc: "黑客松、课程结业、企业培训、行业论坛与校友交流。",
                href: "/activities",
                label: "查看活动",
              },
              {
                icon: Building2,
                title: "城市合伙人",
                desc: "面向课程合作、活动共建、产业资源与区域运营的伙伴网络。",
                href: "/partner",
                label: "了解合作",
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.06 }}
                >
                  <Link
                    href={item.href}
                    className="group block h-full rounded-[1.35rem] border border-[#123f3e]/18 bg-[#f6f1e7]/65 p-6 transition hover:-translate-y-1 hover:bg-[#f8f3e8]"
                  >
                    <Icon className="h-5 w-5 text-[#f07d63]" />
                    <h3 className="mt-6 text-2xl font-semibold tracking-[-0.04em]">
                      {item.title}
                    </h3>
                    <p className="mt-3 min-h-16 text-sm leading-6 text-[#123f3e]/60">
                      {item.desc}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#123f3e]">
                      {item.label}{" "}
                      <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="scroll-mt-16 bg-[#0b1c24] py-24 text-[#f7f1e5] sm:py-32"
      >
        <div className="mx-auto grid max-w-[1440px] gap-12 px-5 sm:px-8 lg:grid-cols-[1fr_.8fr] lg:items-end lg:px-12">
          <motion.div {...reveal}>
            <div className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[#78d6c4]">
              <span className="h-px w-10 bg-[#78d6c4]" />
              06 / START HERE
            </div>
            <h2 className="max-w-3xl text-5xl font-semibold leading-[.95] tracking-[-0.08em] sm:text-7xl">
              先聊清楚目标，
              <br />
              <span className="text-[#78d6c4]">再选择路径。</span>
            </h2>
            <p className="mt-8 max-w-xl text-base leading-7 text-white/55">
              无论你是个人学习者、企业客户、家长，还是希望共建课程与活动的合作伙伴，都可以先告诉我们你的真实目标。
            </p>
          </motion.div>
          <motion.div
            {...reveal}
            transition={{ ...reveal.transition, delay: 0.12 }}
            className="border-t border-white/15 pt-6"
          >
            <div className="mb-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
              <a
                href="mailto:contact@aihuangpu.ai"
                className="group flex items-center gap-4 text-white transition hover:text-[#78d6c4]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 group-hover:border-[#78d6c4]/60">
                  <Mail className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs text-white/40">邮箱</span>
                  <span className="mt-1 block font-medium">
                    contact@aihuangpu.ai
                  </span>
                </span>
              </a>
              <div className="flex items-center gap-4 text-white">
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-xs text-white/40">总部</span>
                  <span className="mt-1 block font-medium">深圳市福田区</span>
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:contact@aihuangpu.ai"
                className="inline-flex items-center gap-2 rounded-full bg-[#ffb84d] px-5 py-3 text-sm font-bold text-[#07151d] transition hover:-translate-y-1"
              >
                预约咨询 <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href="#path"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:border-white/60"
              >
                重新选择路径 <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
