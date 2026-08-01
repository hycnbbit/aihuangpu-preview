/*
 * AdvantagesSection — AI 黄埔学院
 * 风格：深色背景，五大优势，左右错位布局，数字强调
 */
import { useEffect, useRef, useState } from "react";
import { BookOpen, UserCheck, Target, HeartHandshake, Network } from "lucide-react";

const advantages = [
  {
    number: "01",
    icon: BookOpen,
    title: "体系最完整",
    subtitle: "从入门到专家，一站式成长",
    desc: "全链路课程体系，覆盖通识 — 工具 — 技能 — 实战 — 就业 — 创业，随学随升，终身升级。无论你处于哪个阶段，都有对应的成长路径。",
    tags: ["通识入门", "工具实操", "技能进阶", "实战项目", "就业推荐", "创业孵化"],
  },
  {
    number: "02",
    icon: UserCheck,
    title: "师资最硬核",
    subtitle: "大厂专家 + 实战导师",
    desc: "讲师均来自头部科技企业、AI 创业公司、知名高校，只教真东西、只讲真案例、只带真项目。每位导师都经过严格筛选，确保教学质量。",
    tags: ["头部大厂", "AI 创业公司", "知名高校", "实战经验"],
  },
  {
    number: "03",
    icon: Target,
    title: "教学最实战",
    subtitle: "学完就能用，用了就见效",
    desc: "拒绝纸上谈兵，项目制、案例化、工具包、作业批改、1V1 辅导，确保人人学会、学透、能用。每个课程模块都有对应的实战项目。",
    tags: ["项目制学习", "案例化教学", "1V1 辅导", "作业批改"],
  },
  {
    number: "04",
    icon: HeartHandshake,
    title: "服务最全面",
    subtitle: "学 — 练 — 测 — 评 — 荐全闭环",
    desc: "线上直播 + 录播、线下集训、社群伴学、就业推荐、企业内训、证书认证，一次入学，终身陪伴。让学习不再孤单，让成长有迹可循。",
    tags: ["线上直播", "线下集训", "社群伴学", "证书认证"],
  },
  {
    number: "05",
    icon: Network,
    title: "生态最强大",
    subtitle: "人脉 + 资源 + 机会",
    desc: "AI 黄埔校友社群、企业合作通道、项目对接、实习就业、创业孵化，让学习变成终身竞争力。加入即获得一个强大的 AI 人才生态圈。",
    tags: ["校友社群", "企业合作", "项目对接", "创业孵化"],
  },
];

function AdvantageItem({ adv, index }: { adv: typeof advantages[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = adv.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const isEven = index % 2 === 0;

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "visible" : ""} flex flex-col md:flex-row gap-6 items-start`}
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {/* Number + Icon */}
      <div className={`flex-shrink-0 flex flex-col items-center gap-3 ${isEven ? "md:order-1" : "md:order-3"}`}>
        <div className="text-6xl font-black text-[#E63329]/20 leading-none select-none" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {adv.number}
        </div>
        <div className="w-12 h-12 bg-[#E63329] rounded-xl flex items-center justify-center shadow-lg shadow-[#E63329]/30">
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Connector line */}
      <div className="hidden md:flex items-center justify-center order-2 w-8">
        <div className="w-px h-full bg-gradient-to-b from-[#E63329]/60 to-transparent min-h-[80px]" />
      </div>

      {/* Content */}
      <div className={`flex-1 pb-8 border-b border-gray-100 last:border-0 ${isEven ? "md:order-3" : "md:order-1"}`}>
        <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {adv.title}
        </h3>
        <p className="text-[#E63329] text-sm font-semibold mb-3">{adv.subtitle}</p>
        <p className="text-gray-600 text-sm leading-relaxed mb-4">{adv.desc}</p>
        <div className="flex flex-wrap gap-2">
          {adv.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-[#E63329]/8 text-[#E63329] text-xs font-semibold rounded-full border border-[#E63329]/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdvantagesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="advantages" className="py-20 bg-white">
      <div className="container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left: Title */}
          <div
            ref={titleRef}
            className={`scroll-reveal ${titleVisible ? "visible" : ""} lg:sticky lg:top-24`}
          >
            <div className="inline-flex items-center gap-2 bg-[#E63329]/10 border border-[#E63329]/30 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#E63329] rounded-full" />
              <span className="text-[#E63329] text-sm font-semibold">五大核心优势</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-6 leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              选择 AI 黄埔学院
              <br />
              <span className="text-[#E63329]">的五大理由</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              我们不只是一所培训机构，更是你 AI 时代成长路上最可靠的伙伴。
              从课程体系到师资力量，从教学方式到就业服务，每一个环节都经过精心设计。
            </p>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "1万+", label: "学员信任" },
                { value: "50+", label: "精品课程" },
                { value: "50+", label: "实战导师" },
                { value: "98%", label: "好评率" },
              ].map((s) => (
                <div key={s.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="text-2xl font-black text-[#E63329]" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    {s.value}
                  </div>
                  <div className="text-gray-500 text-sm mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Advantages List */}
          <div className="space-y-2">
            {advantages.map((adv, i) => (
              <AdvantageItem key={adv.number} adv={adv} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
