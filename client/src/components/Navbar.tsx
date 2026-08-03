import { Menu, Sparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { deployPath } from "@/lib/deployPath";

type NavbarProps = {
  tone?: "light" | "dark";
};

const links = [
  { label: "首页", href: "/" },
  { label: "课程体系", href: "#path" },
  { label: "企业服务", href: "#enterprise" },
  { label: "青少年科创", href: "#youth" },
  { label: "学生作品", href: "/showcase" },
  { label: "活动", href: "/activities" },
  { label: "师资", href: "/teachers" },
];

export default function Navbar({ tone = "dark" }: NavbarProps) {
  const [location] = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const isLight = tone === "light";
  const isHome = location === "/" || location.startsWith("/#");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navigateToHash = (hash: string) => {
    setMenuOpen(false);
    if (!isHome) {
      window.location.href = deployPath(`/${hash}`);
      return;
    }
    document
      .querySelector(hash)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderLink = (link: (typeof links)[number], mobile = false) => {
    const baseClass = mobile
      ? `rounded-xl px-4 py-3 text-sm ${isLight ? "text-[#123f3e]/70 hover:text-[#123f3e]" : "text-white/70 hover:text-white"}`
      : `whitespace-nowrap rounded-full px-3.5 py-2 text-[13px] font-medium transition ${isLight ? "text-[#123f3e]/65 hover:text-[#123f3e]" : "text-white/65 hover:text-white"}`;

    if (link.href.startsWith("#")) {
      return (
        <a
          key={link.href}
          href={isHome ? link.href : deployPath(`/${link.href}`)}
          onClick={event => {
            event.preventDefault();
            navigateToHash(link.href);
          }}
          className={baseClass}
        >
          {link.label}
        </a>
      );
    }

    return (
      <Link
        key={link.href}
        href={link.href}
        onClick={() => setMenuOpen(false)}
        className={baseClass}
      >
        {link.label}
      </Link>
    );
  };

  const headerClass = isLight
    ? `text-[#123f3e] ${scrolled ? "bg-[#f6f1e7]/95 shadow-[0_10px_35px_rgba(18,63,62,.08)]" : "bg-[#f6f1e7]/80"}`
    : `text-[#f7f1e5] ${scrolled ? "bg-[#07151d]/95 shadow-[0_10px_35px_rgba(0,0,0,.22)]" : "bg-[#07151d]/80"}`;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-transparent backdrop-blur-xl transition-all duration-300 ${headerClass} ${
        scrolled ? "border-current/10" : ""
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[1440px] items-center justify-between gap-6 px-5 sm:px-8 lg:px-10 xl:px-12">
        <Link
          href="/"
          className="group flex shrink-0 items-center gap-3"
          onClick={() => setMenuOpen(false)}
        >
          <span
            className={`relative flex h-9 w-9 items-center justify-center rounded-[0.7rem] border transition-transform duration-300 group-hover:rotate-6 ${
              isLight
                ? "border-[#123f3e]/25 bg-[#123f3e] text-[#f6f1e7]"
                : "border-[#78d6c4]/40 bg-[#78d6c4] text-[#07151d]"
            }`}
          >
            <Sparkles className="h-4 w-4" />
            <span
              className={`absolute -right-1 -top-1 h-2 w-2 rounded-full ${isLight ? "bg-[#ff806e]" : "bg-[#ffb84d]"}`}
            />
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[15px] font-bold tracking-[-0.03em]">
              AI 黄埔学院
            </span>
            <span
              className={`mt-1 font-mono text-[9px] uppercase tracking-[0.22em] ${isLight ? "text-[#123f3e]/50" : "text-white/45"}`}
            >
              AI Education Lab
            </span>
          </span>
        </Link>

        <nav
          className="hidden min-w-0 items-center justify-center gap-0.5 lg:flex"
          aria-label="主导航"
        >
          {links.map(link => renderLink(link))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <a
            href={isHome ? "#contact" : deployPath("/#contact")}
            onClick={event => {
              event.preventDefault();
              navigateToHash("#contact");
            }}
            className={`rounded-full px-5 py-2.5 text-xs font-bold transition hover:-translate-y-0.5 ${
              isLight
                ? "bg-[#123f3e] text-[#f6f1e7] hover:bg-[#1d5754]"
                : "bg-[#ffb84d] text-[#07151d] hover:bg-[#ffd081]"
            }`}
          >
            预约咨询
          </a>
        </div>

        <button
          type="button"
          aria-label={menuOpen ? "关闭菜单" : "打开菜单"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(open => !open)}
          className={`rounded-full p-2 lg:hidden ${isLight ? "text-[#123f3e]/70" : "text-white/70"}`}
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div
          className={`border-t px-5 pb-5 pt-3 lg:hidden ${isLight ? "border-[#123f3e]/10 bg-[#f6f1e7]" : "border-white/10 bg-[#07151d]"}`}
        >
          <nav
            className="mx-auto flex max-w-[1440px] flex-col gap-1"
            aria-label="移动端主导航"
          >
            {links.map(link => renderLink(link, true))}
            <a
              href={isHome ? "#contact" : deployPath("/#contact")}
              onClick={event => {
                event.preventDefault();
                navigateToHash("#contact");
              }}
              className={`mt-2 rounded-xl px-4 py-3 text-center text-sm font-bold ${
                isLight
                  ? "bg-[#123f3e] text-[#f6f1e7]"
                  : "bg-[#ffb84d] text-[#07151d]"
              }`}
            >
              预约咨询
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
