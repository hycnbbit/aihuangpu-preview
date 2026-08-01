/*
 * Partner — AI 黄埔学院城市合伙人页面
 */
import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, TrendingUp, Users, Award, ChevronRight } from "lucide-react";
import { runtimeAssetOrFallback } from "@/lib/publicAsset";

const benefits = [
  {
    icon: TrendingUp,
    title: "独家区域授权",
    desc: "获得指定城市独家运营授权，享受区域保护政策，无竞争困扰。",
  },
  {
    icon: Users,
    title: "品牌赋能支持",
    desc: "共享 AI 黄埔学院品牌资源，总部提供完整课程体系与教学支持。",
  },
  {
    icon: Award,
    title: "导师资源共享",
    desc: "接入全国顶级 AI 实战导师资源，为本地学员提供高质量课程。",
  },
  {
    icon: MapPin,
    title: "运营落地指导",
    desc: "总部提供招生、运营、活动全流程SOP，快速复制成功模式。",
  },
];

const steps = [
  { num: "01", title: "提交申请", desc: "填写城市合伙人申请表，提交基本信息与合作意向" },
  { num: "02", title: "资质审核", desc: "总部团队对申请资质进行评估，1-3个工作日内反馈" },
  { num: "03", title: "签约授权", desc: "通过审核后签订合作协议，获得城市独家授权资格" },
  { num: "04", title: "培训上岗", desc: "参加总部系统培训，掌握运营方法论与课程体系" },
  { num: "05", title: "开城运营", desc: "在总部支持下启动本地招生与活动，开启合伙人之旅" },
];

export default function Partner() {
  const heroRef = useRef<HTMLDivElement>(null);
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
              <span className="text-[#E63329] text-sm font-semibold">城市合伙人招募中</span>
            </div>
            <h1
              className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              与 AI 黄埔学院
              <br />
              <span className="text-[#E63329]">共建 AI 教育版图</span>
            </h1>
            <p className="text-white/60 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
              诚邀有志于 AI 教育事业的伙伴加入，获得城市独家授权，共享品牌与课程资源，携手开拓本地市场。
            </p>
            <a
              href={`${import.meta.env.BASE_URL}#contact`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30"
            >
              立即申请合伙人
              <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-[#0D1117]">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              合伙人<span className="text-[#E63329]">核心权益</span>
            </h2>
            <p className="text-white/50 text-base max-w-xl mx-auto">
              加入 AI 黄埔学院城市合伙人体系，享受全方位资源支持
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={b.title}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-[#E63329]/40 hover:bg-white/8 transition-all duration-300"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <div className="w-12 h-12 bg-[#E63329]/20 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#E63329]" />
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">{b.title}</h3>
                  <p className="text-white/50 text-sm leading-relaxed">{b.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 bg-white/[0.02]">
        <div className="container">
          <div className="text-center mb-14">
            <h2
              className="text-3xl md:text-4xl font-black text-white mb-4"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              合作<span className="text-[#E63329]">流程</span>
            </h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 items-start justify-between relative">
            <div className="hidden md:block absolute top-8 left-[10%] right-[10%] h-px bg-gradient-to-r from-[#E63329]/20 via-[#E63329]/60 to-[#E63329]/20" />
            {steps.map((s, i) => (
              <div key={s.num} className="flex-1 flex flex-col items-center text-center px-4 relative z-10">
                <div className="w-16 h-16 rounded-full bg-[#E63329] flex items-center justify-center text-white font-black text-lg mb-4 shadow-lg shadow-[#E63329]/30">
                  {s.num}
                </div>
                <h3 className="text-white font-bold text-base mb-2">{s.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
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
              准备好开启<span className="text-[#E63329]">合伙人之旅</span>了吗？
            </h2>
            <p className="text-white/60 mb-8 text-base leading-relaxed">
              扫描下方微信二维码或点击按钮，与我们的合作团队取得联系。
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
              <a
                href={`${import.meta.env.BASE_URL}#contact`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30"
              >
                立即联系我们
                <ChevronRight className="w-5 h-5" />
              </a>
              <div className="flex flex-col items-center gap-2">
                <div className="bg-white p-3 rounded-xl shadow-lg">
                  <img
                    src={runtimeAssetOrFallback(
                      "/manus-storage/wechat-qrcode_fb9000cf.jpg",
                      "images/qr-placeholder.svg",
                    )}
                    alt="微信二维码"
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
