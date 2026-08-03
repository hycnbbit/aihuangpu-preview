import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { deployPath } from "@/lib/deployPath";

const footerLinks = [
  { label: "课程体系", href: "/#path" },
  { label: "企业服务", href: "/#enterprise" },
  { label: "青少年科创", href: "/#youth" },
  { label: "学生作品", href: "/showcase" },
  { label: "活动记录", href: "/activities" },
  { label: "名师团队", href: "/teachers" },
  { label: "城市合伙人", href: "/partner" },
];

export default function Footer() {
  return (
    <footer className="bg-[#07151d] text-[#f7f1e5]">
      <div className="mx-auto max-w-[1440px] px-5 py-16 sm:px-8 lg:px-12">
        <div className="flex flex-col justify-between gap-12 border-b border-white/10 pb-14 lg:flex-row lg:items-end">
          <div className="max-w-xl">
            <div className="mb-6 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#78d6c4] text-[#07151d]">
                <Sparkles className="h-5 w-5" />
              </span>
              <div>
                <div className="font-bold tracking-[-0.03em]">AI 黄埔学院</div>
                <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-white/40">
                  AI Education Lab
                </div>
              </div>
            </div>
            <h2 className="max-w-lg text-3xl font-semibold leading-[1.08] tracking-[-0.04em] sm:text-5xl">
              把 AI 带进真实工作、
              <br />
              <span className="text-[#ffb84d]">真实业务与真实创作。</span>
            </h2>
          </div>
          <div className="flex max-w-sm flex-col gap-4 text-sm text-white/55">
            <p>
              AI 黄埔学院面向个人、管理者、企业与青少年，提供以真实项目为目标的
              AI 实战教育与组织服务。
            </p>
            <a
              href="mailto:contact@aihuangpu.ai"
              className="group inline-flex w-fit items-center gap-2 text-[#78d6c4] transition hover:text-[#b9eee2]"
            >
              contact@aihuangpu.ai
              <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-8 pt-8 text-sm md:flex-row md:items-center">
          <nav className="flex flex-wrap gap-x-6 gap-y-3" aria-label="页脚导航">
            {footerLinks.map(link =>
              link.href.startsWith("/#") ? (
                <a
                  key={link.href}
                  href={deployPath(link.href)}
                  className="text-white/50 transition hover:text-white"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-white/50 transition hover:text-white"
                >
                  {link.label}
                </Link>
              )
            )}
            <a
              href={deployPath("/#contact")}
              className="text-white/50 transition hover:text-white"
            >
              预约咨询
            </a>
          </nav>
          <div className="flex flex-wrap items-center gap-4 font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
            <span>© 2026 AI Huangpu</span>
            <span>Practical AI Education</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
