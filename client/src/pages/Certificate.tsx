/*
 * Certificate — AI 黄埔学院 · 工信部人工智能证书页面
 */
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ChevronRight,
  TrendingUp,
  Briefcase,
  Building2,
  Shield,
} from "lucide-react";
import { deployPath, officialMedia } from "@/lib/deployPath";

const reasons = [
  {
    icon: TrendingUp,
    title: "能力提升",
    color: "#22c55e",
    content:
      "通过系统学习、工具练习和项目训练，学习者可以更清楚地梳理当前能力、目标岗位与下一步成长方向。",
  },
  {
    icon: Briefcase,
    title: "职业晋升",
    color: "#f59e0b",
    content:
      "认证与作品、项目经历一样，都是展示持续学习与专业能力的一种材料；具体作用应结合目标岗位和用人单位要求判断。",
  },
  {
    icon: Shield,
    title: "政策支持",
    color: "#6366f1",
    content:
      "各地区、行业和机构的相关政策与支持会持续变化。报考或申请前，应以当期官方发布信息为准。",
  },
  {
    icon: Building2,
    title: "企业竞争力",
    color: "#78d6c4",
    content:
      "企业在建设 AI 人才梯队时，可以把认证咨询、岗位训练和真实业务项目结合起来，形成更可持续的能力建设方式。",
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
    color: "#78d6c4",
    bgColor: "#78d6c420",
    borderColor: "#78d6c4",
    levels: ["中级", "高级"],
    levelColors: ["#f07060", "#78d6c4"],
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

const consultationSteps = [
  { num: "01", label: "确认适用方向" },
  { num: "02", label: "核对报考条件" },
  { num: "03", label: "匹配学习安排" },
  { num: "04", label: "查看当期信息" },
];

export default function Certificate() {
  const [visible, setVisible] = useState(false);
  const [showQr, setShowQr] = useState(!import.meta.env.DEV);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#0b1c24]">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#78d6c4]/15 via-transparent to-transparent" />
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#78d6c4] to-transparent" />
        <div className="container relative z-10 text-center">
          <div
            className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <div className="inline-flex items-center gap-2 bg-[#78d6c4]/20 border border-[#78d6c4]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#78d6c4] rounded-full animate-pulse" />
              <span className="text-[#78d6c4] text-sm font-semibold">
                工信部权威认证
              </span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              考取工信部
              <br />
              <span className="text-[#78d6c4]">人工智能证书</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              认证咨询与项目训练可以成为 AI
              学习路径的一部分。具体证书名称、报考条件、等级和考试安排，请以当期官方发布信息为准。
            </p>
            <a
              href={deployPath("/#contact")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#78d6c4] hover:bg-[#58b7a7] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#78d6c4]/30"
            >
              立即咨询报考
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Consultation process */}
      <section className="border-y border-white/10 py-12">
        <div className="container">
          <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
            {consultationSteps.map(step => (
              <div key={step.num}>
                <div className="mb-1 font-mono text-3xl font-bold text-[#78d6c4] md:text-4xl">
                  {step.num}
                </div>
                <div className="text-sm text-white/50">{step.label}</div>
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
              为什么要考
              <span className="text-[#78d6c4]"> AI 人工智能证书？</span>
            </h2>
            <p className="text-white/50 text-base max-w-2xl mx-auto leading-relaxed">
              在人工智能浪潮中，专业人才成为最宝贵的资源。这一趋势为从业者带来了多重发展机遇。
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reasons.map(r => {
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
                  <p className="text-white/60 text-sm leading-relaxed">
                    {r.content}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Extra note */}
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-8">
            <p className="text-sm leading-relaxed text-white/60">
              <span className="font-semibold text-white">咨询建议</span>
              ：把认证目标与个人岗位、企业业务场景和可展示项目结合起来。证书信息、课程安排和服务范围会随官方发布与实际需求调整，沟通时请确认当期方案。
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
              证书<span className="text-[#78d6c4]">分类</span>
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              以下展示用于说明咨询与课程组织结构；具体证书名称、等级、报考条件请以当期官方发布为准。
            </p>
          </div>

          {/* Mind Map Style Layout */}
          <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0 justify-center">
            {/* Center Node */}
            <div className="flex-shrink-0">
              <div
                className="bg-[#78d6c4] text-white font-black text-xl px-8 py-5 rounded-2xl shadow-xl shadow-[#78d6c4]/30 text-center"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                工信部
                <br />
                人工智能证书
              </div>
            </div>

            {/* Connector line (desktop) */}
            <div className="hidden lg:block w-16 h-px bg-white/20 flex-shrink-0" />

            {/* Categories */}
            <div className="flex flex-col gap-4 w-full max-w-2xl">
              {certCategories.map(cat => (
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
                    <span className="text-white/30 text-xs ml-2">
                      （无等级划分）
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#0b1c24]">
        <div className="container text-center">
          <div className="max-w-2xl mx-auto bg-gradient-to-br from-[#78d6c4]/20 to-transparent border border-[#78d6c4]/30 rounded-3xl p-12">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              开始您的<span className="text-[#78d6c4]">认证之旅</span>
            </h2>
            <p className="text-white/60 mb-8 text-base leading-relaxed">
              AI
              黄埔学院提供认证咨询与学习支持，具体学习安排将基于已确认的考试信息和个人目标制定。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href={deployPath("/#contact")}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#78d6c4] hover:bg-[#58b7a7] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#78d6c4]/30"
              >
                立即咨询报考
                <ChevronRight className="w-5 h-5" />
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-[8.5rem] w-[8.5rem] items-center justify-center rounded-xl bg-white p-3 text-center shadow-lg">
                  {showQr ? (
                    <img
                      src={officialMedia("wechat-qrcode_fb9000cf.jpg")}
                      alt="微信咨询二维码"
                      onError={() => setShowQr(false)}
                      className="h-28 w-28 object-contain"
                    />
                  ) : (
                    <span className="text-xs font-semibold leading-5 text-[#123f3e]">
                      微信咨询
                      <br />
                      线上环境可见二维码
                    </span>
                  )}
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
