/*
 * Navbar — AI 黄埔学院
 * 风格：深墨背景，红色 Logo 强调，固定顶部，滚动后加深背景
 */
import { useState, useEffect } from "react";
import { Menu, X, Zap } from "lucide-react";
import { Link, useLocation } from "wouter";

const navLinks = [
  { label: "首页", href: "#hero" },
  { label: "课程体系", href: "#courses" },
  { label: "核心优势", href: "#advantages" },
  { label: "我们的使命", href: "#mission" },
];

const aboutLink = { label: "关于我们", href: "#about" };

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location] = useLocation();

  const isHome = location === "/";
  const homeUrl = import.meta.env.BASE_URL;

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    if (isHome) {
      // 在首页：平滑滚动到锚点
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      // 在其他页面：跳回首页并带上锚点
      window.location.href = homeUrl + href;
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0D1117]/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <div className="container">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <a
            href={isHome ? "#hero" : homeUrl}
            onClick={(e) => {
              if (isHome) {
                e.preventDefault();
                handleNavClick("#hero");
              }
            }}
            className="flex items-center gap-2.5 group"
          >
            <div className="w-9 h-9 bg-[#E63329] rounded-sm flex items-center justify-center group-hover:bg-[#c42a21] transition-colors">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-white font-bold text-base tracking-wide" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                AI 黄埔学院
              </span>
              <span className="text-[#E63329] text-[10px] tracking-widest font-medium">
                AI HUANGPU ACADEMY
              </span>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : homeUrl + link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/teachers"
              className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
            >
              名师展示
            </Link>
            <Link
              href="/activities"
              className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
            >
              往期活动
            </Link>
            <Link
              href="/partner"
              className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
            >
              城市合伙人
            </Link>
            <Link
              href="/certificate"
              className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
            >
              认证证书
            </Link>
            <a
              href={isHome ? aboutLink.href : homeUrl + aboutLink.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(aboutLink.href); }}
              className="px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-all duration-200 font-medium"
            >
              {aboutLink.label}
            </a>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => handleNavClick("#contact")}
              className="px-5 py-2 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white text-sm font-semibold rounded transition-all duration-200 btn-pulse"
            >
              立即咨询
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D1117]/98 backdrop-blur-md border-t border-white/10">
          <div className="container py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={isHome ? link.href : homeUrl + link.href}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
                className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/teachers"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
            >
              名师展示
            </Link>
            <Link
              href="/activities"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
            >
              往期活动
            </Link>
            <Link
              href="/partner"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
            >
              城市合伙人
            </Link>
            <Link
              href="/certificate"
              onClick={() => setMenuOpen(false)}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
            >
              认证证书
            </Link>
            <a
              href={isHome ? aboutLink.href : homeUrl + aboutLink.href}
              onClick={(e) => { e.preventDefault(); handleNavClick(aboutLink.href); }}
              className="px-4 py-3 text-white/80 hover:text-white hover:bg-white/10 rounded text-sm font-medium transition-all"
            >
              {aboutLink.label}
            </a>
            <button
              onClick={() => handleNavClick("#contact")}
              className="mt-2 px-5 py-3 bg-[#E63329] hover:bg-[#c42a21] text-white text-sm font-semibold rounded transition-all"
            >
              立即咨询
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
