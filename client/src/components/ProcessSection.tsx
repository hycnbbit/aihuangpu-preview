/*
 * ProcessSection — AI 黄埔学院
 * 风格：白色背景，学习流程时间线，红色节点
 */
import { useEffect, useRef, useState } from "react";
import { ClipboardList, BookOpen, Code2, Trophy, Briefcase, Rocket } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    step: "01",
    title: "免费测评",
    desc: "专属顾问 1V1 了解您的背景与目标，精准匹配最适合的学习路径",
    color: "#E63329",
  },
  {
    icon: BookOpen,
    step: "02",
    title: "系统学习",
    desc: "线上直播 + 录播灵活学习，线下集训深度强化，社群伴学全程陪伴",
    color: "#E63329",
  },
  {
    icon: Code2,
    step: "03",
    title: "实战项目",
    desc: "真实企业级项目实操，导师 1V1 辅导，作业批改，确保学以致用",
    color: "#E63329",
  },
  {
    icon: Trophy,
    step: "04",
    title: "考核认证",
    desc: "通过结业考核获得 AI 黄埔学院认证证书，提升职场竞争力",
    color: "#E63329",
  },
  {
    icon: Briefcase,
    step: "05",
    title: "就业推荐",
    desc: "对接合作企业岗位，简历优化指导，面试辅导，助力快速就业",
    color: "#E63329",
  },
  {
    icon: Rocket,
    step: "06",
    title: "持续成长",
    desc: "终身学员权益，课程持续更新，校友社群共成长，创业孵化支持",
    color: "#E63329",
  },
];

export default function ProcessSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 bg-white">
      <div ref={ref} className="container">
        {/* Header */}
        <div className={`scroll-reveal ${visible ? "visible" : ""} text-center mb-14`}>
          <div className="inline-flex items-center gap-2 bg-[#E63329]/10 border border-[#E63329]/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#E63329] rounded-full" />
            <span className="text-[#E63329] text-sm font-semibold">学习全流程</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            六步成就 AI 精英
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            从入学到就业，每一步都有专业支持，确保你学有所成、学以致用。
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.step}
                className={`scroll-reveal ${visible ? "visible" : ""} relative bg-gray-50 rounded-2xl p-6 border border-gray-100 card-hover group`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                {/* Step number background */}
                <div className="absolute top-4 right-4 text-6xl font-black text-gray-100 leading-none select-none group-hover:text-[#E63329]/10 transition-colors" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {step.step}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-[#E63329] rounded-xl flex items-center justify-center mb-4 shadow-md shadow-[#E63329]/30">
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg font-black text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {step.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">{step.desc}</p>

                {/* Connector arrow (not last) */}
                {i < steps.length - 1 && i % 3 !== 2 && (
                  <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#E63329] rounded-full z-10 flex items-center justify-center">
                    <div className="w-2 h-2 border-r-2 border-t-2 border-white rotate-45 -translate-x-0.5" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className={`scroll-reveal ${visible ? "visible" : ""} text-center mt-12`} style={{ transitionDelay: "500ms" }}>
          <button
            onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
            className="px-10 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30 btn-pulse"
          >
            开始我的 AI 成长之旅
          </button>
        </div>
      </div>
    </section>
  );
}
