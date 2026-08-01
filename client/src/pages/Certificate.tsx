/*
 * Certificate — AI 黄埔学院 · 工信部人工智能证书页面
 */
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ChevronRight, TrendingUp, Briefcase, Building2, Shield } from "lucide-react";

const reasons = [
  {
    icon: TrendingUp,
    title: "能力提升",
    color: "#22c55e",
    content:
      "系统化的人工智能培训体系为从业者提供了权威的学习路径。通过理论与实践相结合的课程体系，学习者能够在 3–6 个月内掌握核心技能。项目驱动的教学模式确保学员获得解决实际问题的能力，学习效果较传统方式提升 50% 以上。",
  },
  {
    icon: Briefcase,
    title: "职业晋升",
    color: "#f59e0b",
    content:
      "人工智能专业技能认证已成为职场竞争力的重要体现。在数字化转型企业中，持有权威认证的员工获得晋升的机会比普通员工高出 47%。特别是在智能制造、智慧医疗等新兴领域，专业认证是技术岗位任职资格的重要参考依据。",
  },
  {
    icon: Shield,
    title: "政策支持",
    color: "#6366f1",
    content:
      "各地政府纷纷出台人工智能人才激励政策。深圳、杭州等城市为人工智能高级人才提供最高 200 万元的安家补贴。超过 70% 的科技企业设立了专门的技能认证津贴，持证员工月薪平均增加 15%–30%。",
  },
  {
    icon: Building2,
    title: "企业竞争力",
    color: "#E63329",
    content:
      "人工智能专业人才储备正成为核心竞争力。在政府项目招标中，团队专业资质已成为重要的评审指标。拥有认证人工智能工程师的团队中标率提高 35%。在医疗 AI、工业互联网等重点领域，专业人才梯队建设更是企业参与市场竞争的必备条件。",
  },
];

// 证书分类数据
const certCategories = [
  {
    name: "人工智能算法工程师",
    color: "#4a8c7a",
    bgColor: "#4a8c7a20",
    borderColor: "#4a8c7a",
    levels: ["中级", "高级"],
    levelColors: ["#6aaa96", "#4a8c7a"],
  },
  {
    name: "人工智能应用工程师",
    color: "#c9a84c",
    bgColor: "#c9a84c20",
    borderColor: "#c9a84c",
    levels: ["初级", "中级", "高级"],
    levelColors: ["#e8c97a", "#c9a84c", "#a88430"],
  },
  {
    name: "AI 智能体应用工程师",
    color: "#E63329",
    bgColor: "#E6332920",
    borderColor: "#E63329",
    levels: ["中级", "高级"],
    levelColors: ["#f07060", "#E63329"],
  },
  {
    name: "AIGC 应用工程师",
    color: "#7aaa8a",
    bgColor: "#7aaa8a20",
    borderColor: "#7aaa8a",
    levels: ["初级", "中级", "高级"],
    levelColors: ["#a0c8a8", "#7aaa8a", "#5a8a6a"],
  },
  {
    name: "人工智能训练工程师",
    color: "#4a8c7a",
    bgColor: "#4a8c7a20",
    borderColor: "#4a8c7a",
    levels: ["中级", "高级"],
    levelColors: ["#6aaa96", "#4a8c7a"],
  },
];

const stats = [
  { num: "1000万", label: "2025年AI人才缺口预测" },
  { num: "47%", label: "持证员工晋升机会提升" },
  { num: "200万", label: "部分城市最高人才补贴" },
  { num: "35%", label: "认证团队中标率提升" },
];

export default function Certificate() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E63329]/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E63329] to-transparent" />
        <div className="container relative z-10 text-center">
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 bg-[#E63329]/20 border border-[#E63329]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#E63329] rounded-full animate-pulse" />
              <span className="text-[#E63329] text-sm font-semibold">工信部权威认证</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              考取工信部
              <br />
              <span className="text-[#E63329]">人工智能证书</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              据人力资源社会保障部预测，到 2025 年，我国人工智能人才缺口将达 <strong className="text-white">1000 万</strong>。
              专业认证，是您在 AI 时代脱颖而出的核心竞争力。
            </p>
            <a
              href="/#contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30"
            >
              立即咨询报考
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-white/10">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((v) => (
              <div key={v.label}>
                <div className="text-3xl md:text-4xl font-black text-[#E63329] mb-1">{v.num}</div>
                <div className="text-white/50 text-sm">{v.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              为什么要考<span className="text-[#E63329]"> AI 人工智能证书？</span>
            </h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
              在人工智能浪潮中，专业人才成为最宝贵的资源。这一趋势为从业者带来了多重发展机遇。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map((r) => {
              const Icon = r.icon;
              return (
                <div
                  key={r.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                      style={{ backgroundColor: r.color + "20" }}
                    >
                      <Icon className="w-6 h-6" style={{ color: r.color }} />
                    </div>
                    <h3 className="text-white font-black text-xl">{r.title}</h3>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed">{r.content}</p>
                </div>
              );
            })}
          </div>

          {/* Extra paragraph */}
          <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-8">
            <p className="text-white/60 text-sm leading-relaxed">
              <span className="text-white font-semibold">值得注意的是</span>，人工智能与传统产业的融合正在创造新的价值增长点。传统制造企业通过引入 AI 技术，平均生产效率提升 40%，运营成本降低 25%。服务业企业利用人工智能优化服务流程，客户满意度提升 30 个百分点。这些实实在在的效益转化，进一步强化了市场对人工智能专业人才的渴求。
            </p>
          </div>
        </div>
      </section>

      {/* Certificate Categories */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              证书<span className="text-[#E63329]">分类</span>
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              工信部人工智能证书涵盖五大方向，多个等级，满足不同职业发展需求
            </p>
          </div>

          {/* Mind Map Style Layout */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 justify-center">
            {/* Center Node */}
            <div className="flex-shrink-0">
              <div className="bg-[#E63329] text-white font-black text-xl px-8 py-5 rounded-2xl shadow-xl shadow-[#E63329]/30 text-center"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                工信部<br />人工智能证书
              </div>
            </div>

            {/* Connector line (desktop) */}
            <div className="hidden lg:block w-16 h-px bg-white/20 flex-shrink-0" />

            {/* Categories */}
            <div className="flex flex-col gap-4 w-full max-w-2xl">
              {certCategories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-4">
                  {/* Connector line (desktop) */}
                  <div
                    className="hidden lg:block w-8 h-px flex-shrink-0"
                    style={{ backgroundColor: cat.borderColor + "80" }}
                  />
                  {/* Category label */}
                  <div
                    className="flex-shrink-0 px-5 py-2.5 rounded-xl font-bold text-sm border"
                    style={{
                      backgroundColor: cat.bgColor,
                      borderColor: cat.borderColor,
                      color: cat.color,
                    }}
                  >
                    {cat.name}
                  </div>
                  {/* Levels */}
                  {cat.levels.length > 0 && (
                    <>
                      <div
                        className="hidden lg:block w-6 h-px flex-shrink-0"
                        style={{ backgroundColor: cat.borderColor + "60" }}
                      />
                      <div className="flex gap-2 flex-wrap">
                        {cat.levels.map((level, li) => (
                          <span
                            key={level}
                            className="px-3 py-1 rounded-lg text-xs font-semibold border"
                            style={{
                              backgroundColor: cat.levelColors[li] + "20",
                              borderColor: cat.levelColors[li] + "60",
                              color: cat.levelColors[li],
                            }}
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                  {cat.levels.length === 0 && (
                    <span className="text-white/30 text-xs ml-2">（无等级划分）</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0D1117]">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#E63329]/20 to-transparent border border-[#E63329]/30 rounded-3xl p-12">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              开始您的<span className="text-[#E63329]">认证之旅</span>
            </h2>
            <p className="text-white/60 mb-8 text-base leading-relaxed">
              AI 黄埔学院提供系统化备考培训，助您高效通过工信部人工智能认证考试。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30"
              >
                立即咨询报考
                <ChevronRight className="w-5 h-5" />
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <img
                    src="/manus-storage/wechat-qrcode_fb9000cf.jpg"
                    alt="微信咨询二维码"
                    className="w-28 h-28 object-contain"
                  />
                </div>
                <span className="text-white/50 text-xs">扫码添加微信咨询</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
