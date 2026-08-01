/*
 * HeroSection — AI 黄埔学院
 * 风格：全屏暗色英雄区，红色斜切装饰，强力标语，数字统计
 */
import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

const HERO_BG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/hero-banner-dLsaLQLete8b9kw4vixHgJ.webp";

const stats = [
  { value: 10000, suffix: "+", label: "学员人数" },
  { value: 50, suffix: "+", label: "精品课程" },
  { value: 50, suffix: "+", label: "实战导师" },
  { value: 98, suffix: "%", label: "学员满意度" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, delay, start }: { value: number; suffix: string; label: string; delay: number; start: boolean }) {
  const count = useCountUp(value, 2000, start);
  const display = count >= 10000 ? `${(count / 10000).toFixed(count >= 100000 ? 0 : 1)}万` : count.toString();
  return (
    <div
      className="text-center animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: "both" }}
    >
      <div className="text-3xl md:text-4xl font-black text-white" style={{ fontFamily: "'Noto Serif SC', serif" }}>
        {display}{suffix}
      </div>
      <div className="text-white/60 text-sm mt-1 font-medium">{label}</div>
    </div>
  );
}

export default function HeroSection() {
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setStatsVisible(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const scrollToNext = () => {
    const el = document.querySelector("#courses");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${HERO_BG})` }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0D1117]/70 via-[#0D1117]/50 to-[#0D1117]/90" />
      {/* Red accent lines */}
      <div className="absolute top-0 left-0 w-1 h-full bg-[#E63329]" />
      <div className="absolute top-0 right-0 w-1 h-full bg-[#E63329]/40" />

      {/* Content */}
      <div className="relative z-10 container pt-24 pb-16">
        <div className="max-w-4xl">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 bg-[#E63329]/20 border border-[#E63329]/40 rounded-full px-4 py-1.5 mb-6 animate-fade-in-up"
            style={{ animationDelay: "100ms", animationFillMode: "both" }}
          >
            <span className="w-2 h-2 bg-[#E63329] rounded-full animate-pulse" />
            <span className="text-[#E63329] text-sm font-semibold tracking-wide">中国 AI 垂直培训领军品牌</span>
          </div>

          {/* Main Headline */}
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4 animate-fade-in-up"
            style={{ animationDelay: "200ms", animationFillMode: "both", fontFamily: "'Noto Serif SC', serif" }}
          >
            让人人掌握 AI
            <br />
            <span className="text-[#E63329]">让 AI 成就未来</span>
          </h1>

          {/* Sub Headline */}
          <p
            className="text-lg md:text-xl text-white/75 max-w-2xl leading-relaxed mb-8 animate-fade-in-up"
            style={{ animationDelay: "350ms", animationFillMode: "both" }}
          >
            AI 时代已来，不会用 AI 的人正在被超越。AI 黄埔学院，用黄埔精神锻造 AI 铁军，
            用实战体系赋能全民成长。
          </p>

          {/* CTA Buttons */}
          <div
            className="flex flex-wrap gap-4 mb-16 animate-fade-in-up"
            style={{ animationDelay: "500ms", animationFillMode: "both" }}
          >
            <button
              onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white font-bold text-base rounded transition-all duration-200 shadow-lg shadow-[#E63329]/30 btn-pulse"
            >
              立即免费咨询
            </button>
            <button
              onClick={() => document.querySelector("#courses")?.scrollIntoView({ behavior: "smooth" })}
              className="px-8 py-4 bg-white/10 hover:bg-white/20 active:scale-95 text-white font-semibold text-base rounded border border-white/30 transition-all duration-200 backdrop-blur-sm"
            >
              查看课程体系 →
            </button>
          </div>

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-white/20"
          >
            {stats.map((stat, i) => (
              <StatItem key={stat.label} {...stat} delay={600 + i * 100} start={statsVisible} />
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        onClick={scrollToNext}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors animate-bounce"
      >
        <ChevronDown className="w-8 h-8" />
      </button>
    </section>
  );
}
