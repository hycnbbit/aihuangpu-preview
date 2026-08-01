/*
 * AboutSection — AI 黄埔学院
 * 风格：白色背景，机构定位展示，赛道标签，不对称布局
 */
import { useEffect, useRef, useState } from "react";
import { Shield, Zap, BarChart3, Brain, Bot, Database, Cpu, LineChart } from "lucide-react";

const tracks = [
  { icon: Brain, label: "大模型应用" },
  { icon: Bot, label: "AIGC 创作" },
  { icon: Cpu, label: "智能办公" },
  { icon: Zap, label: "自动化流程" },
  { icon: BarChart3, label: "数据分析" },
  { icon: Database, label: "AI 商业应用" },
  { icon: LineChart, label: "AI 数字营销" },
  { icon: Shield, label: "AI 安全合规" },
];

const features = [
  {
    title: "专注垂直",
    desc: "只做 AI，深耕大模型、AIGC、智能办公、自动化、数据分析、AI 商业应用全赛道",
    highlight: "只做 AI",
  },
  {
    title: "专业权威",
    desc: "一线大厂技术专家、AI 实战导师、企业高管联合教研，课程与产业同频迭代",
    highlight: "与产业同频",
  },
  {
    title: "规模领先",
    desc: "线上线下一体化教学，全国覆盖，万人同训，打造 AI 人才黄埔军校",
    highlight: "全国覆盖",
  },
  {
    title: "实战为王",
    desc: "项目制学习、案例化教学、工具化落地，学完即用、即用即见效",
    highlight: "即用即见效",
  },
];

export default function AboutSection() {
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
    <section id="about" className="py-20 bg-gray-50">
      <div ref={ref} className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Content */}
          <div className={`scroll-reveal ${visible ? "visible" : ""}`}>
            <div className="inline-flex items-center gap-2 bg-[#E63329]/10 border border-[#E63329]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#E63329] rounded-full" />
              <span className="text-[#E63329] text-sm font-semibold">我们的定位</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4 leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              中国 AI 垂直培训
              <br />
              <span className="text-[#E63329]">第一品牌</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              AI 黄埔学院，立志成为国内最专业、规模最大、体系最完整的 AI 垂直类培训机构，
              以"培养 AI 时代领军人才与实战精英"为使命，用黄埔精神锻造 AI 铁军。
            </p>

            {/* Feature list */}
            <div className="space-y-4">
              {features.map((f, i) => (
                <div
                  key={f.title}
                  className={`scroll-reveal ${visible ? "visible" : ""} flex gap-4 items-start`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-1 h-full min-h-[60px] bg-[#E63329] rounded-full shrink-0 mt-1" />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-bold text-gray-900">{f.title}</h4>
                      <span className="px-2 py-0.5 bg-[#E63329] text-white text-xs font-bold rounded">
                        {f.highlight}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Tracks Grid */}
          <div className={`scroll-reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "200ms" }}>
            <div className="bg-[#0D1117] rounded-3xl p-8 relative overflow-hidden">
              {/* Decorative */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#E63329]/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#E63329]/10 rounded-full blur-2xl" />

              <div className="relative z-10">
                <h3 className="text-white font-black text-xl mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  全赛道覆盖
                </h3>
                <p className="text-white/50 text-sm mb-6">专注 AI 垂直领域，深耕八大核心赛道</p>

                <div className="grid grid-cols-2 gap-3">
                  {tracks.map((t, i) => {
                    const Icon = t.icon;
                    return (
                      <div
                        key={t.label}
                        className={`scroll-reveal ${visible ? "visible" : ""} flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:bg-[#E63329]/20 hover:border-[#E63329]/40 transition-all duration-200 cursor-default`}
                        style={{ transitionDelay: `${300 + i * 60}ms` }}
                      >
                        <Icon className="w-5 h-5 text-[#E63329] shrink-0" />
                        <span className="text-white/80 text-sm font-medium">{t.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Bottom CTA */}
                <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="text-white/50 text-sm mb-3">不做泛泛的技术科普，只做可落地、能变现、好就业的 AI 实战教育</p>
                  <button
                    onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
                    className="px-6 py-2.5 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white text-sm font-semibold rounded-lg transition-all duration-200"
                  >
                    立即了解课程
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
