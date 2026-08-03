/*
 * MissionSection — AI 黄埔学院
 * 风格：深色背景，使命愿景展示，红色强调，大字排版
 */
import { useEffect, useRef, useState } from "react";
import { Flame, Globe, Users2, TrendingUp } from "lucide-react";

const pillars = [
  {
    icon: Users2,
    title: "赋能个人",
    desc: "让每一个普通人都能轻松掌握 AI，开启人生新可能",
  },
  {
    icon: TrendingUp,
    title: "驱动产业",
    desc: "让每一家企业都能低成本落地 AI，实现数字化转型",
  },
  {
    icon: Globe,
    title: "站上世界舞台",
    desc: "让中国 AI 人才站在世界舞台中央，引领全球 AI 发展",
  },
  {
    icon: Flame,
    title: "黄埔精神",
    desc: "学习黄埔精神，锻造 AI 时代的实战精英铁军",
  },
];

export default function MissionSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="mission" className="py-20 bg-[#0D1117] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E63329] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E63329] to-transparent" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-[#E63329]/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-64 h-64 bg-[#E63329]/5 rounded-full blur-3xl -translate-y-1/2" />

      <div ref={ref} className="container relative z-10">
        {/* Section Header */}
        <div className={`scroll-reveal ${visible ? "visible" : ""} text-center mb-14`}>
          <div className="inline-flex items-center gap-2 bg-[#E63329]/20 border border-[#E63329]/40 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#E63329] rounded-full animate-pulse" />
            <span className="text-[#E63329] text-sm font-semibold">使命与愿景</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            以 AI 赋能个人成长
            <br />
            <span className="text-[#E63329]">以技术驱动产业升级</span>
          </h2>
          <p className="text-white/60 text-lg max-w-3xl mx-auto leading-relaxed">
            AI 黄埔学院，致力于让每一个普通人都能轻松掌握 AI，让每一家企业都能低成本落地 AI，
            让中国 AI 人才站在世界舞台中央。
          </p>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`scroll-reveal ${visible ? "visible" : ""} bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-[#E63329]/40 transition-all duration-300 card-hover`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-12 h-12 bg-[#E63329]/20 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[#E63329]" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {p.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">{p.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Big Quote */}
        <div className={`scroll-reveal ${visible ? "visible" : ""} bg-gradient-to-r from-[#E63329]/20 via-[#E63329]/10 to-transparent border border-[#E63329]/30 rounded-2xl p-8 md:p-12`}>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="text-8xl text-[#E63329]/30 font-black leading-none select-none" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              "
            </div>
            <div className="flex-1">
              <p className="text-white text-xl md:text-2xl font-semibold leading-relaxed mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                未来已来，AI 不是选择，而是必备能力。
                加入 AI 黄埔学院，与百万精英同行，
                成为 AI 时代的领跑者！
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-[#E63329]" />
                <span className="text-[#E63329] font-semibold text-sm">AI 黄埔学院 创始人寄语</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
