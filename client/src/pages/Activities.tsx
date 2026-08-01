/*
 * Activities — AI 黄埔学院往期活动页面
 * 风格：与主站一致，深色头部 + 白色内容区，卡片式活动展示
 */
import { useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, Calendar, MapPin, Users, ChevronRight, X } from "lucide-react";
import { Zap } from "lucide-react";
import { runtimeAssetOrFallback } from "@/lib/publicAsset";

const EVENT_PLACEHOLDER = "images/event-placeholder.svg";

const activities = [
  {
    id: 6,
    tag: "香港黑客松",
    tagColor: "#E63329",
    title: "首期香港青少年 AI 黑客松",
    date: "7月4日",
    location: "香港·天后 CAI 大厦",
    attendees: "香港、深圳、韩国青少年",
    attendeesLabel: "香港、深圳、韩国多地青少年参与",
    summary:
      "7月4日，由 AI 黄埔学院主办的首期香港青少年 AI 黑客松在天后 CAI 大厦顺利举行。本次活动得到 CAI 大厦的大力支持；CAI 大厦由著名天使投资人、美图秀秀创始人蔡文胜先生全资购入，旨在打造新型 AI-Web3 创业中心。黑客松吸引了来自香港、深圳、韩国的多位青少年参加。大家在导师指导下完成高质量作品，并全部登台进行项目路演，获得家长的高度认可和赞扬。应大家的强烈要求，第二期黑客松将于7月18日在 CAI 大厦举行。",
    highlights: ["多地青少年同场创作", "导师全程项目指导", "全员完成项目路演", "第二期7月18日举行"],
    image: runtimeAssetOrFallback(
      "/manus-storage/hong-kong-youth-ai-hackathon-2026_25f29e55.jpg",
      EVENT_PLACEHOLDER,
    ),
  },
  {
    id: 5,
    tag: "SSA 2026",
    tagColor: "#1a56db",
    title: "2026 亚洲智能传感器与应用技术博览会 AI 分论坛",
    date: "2026年6月24日-26日",
    location: "深圳会展中心（福田）",
    attendees: "300+",
    attendeesLabel: "全球300+企业参展",
    summary:
      "2026亚洲智能传感器与应用技术博览会（SSA 2026）在深圳会展中心（福田）举行，展览面积超10000平方米，由广东省投资促进局指导，广东省电子信息行业协会和提客易（上海）会展有限公司联合主办，汇聚全球300余家企业展示智能传感前沿技术。AI黄埔学院作为协办方组织了25日下午的AI分论坛，进行了主题演讲和圆桌论坛，现场异常火爆，观众反响积极。",
    highlights: ["10000+平方米展览面积", "全球300+企业参展", "AI分论坛主题演讲", "圆桌论坛反响热烈"],
    image: runtimeAssetOrFallback(
      "/manus-storage/activity-ssa-2026-forum_d204f656.jpg",
      EVENT_PLACEHOLDER,
    ),
  },
  {
    id: 1,
    tag: "太原站",
    tagColor: "#E63329",
    title: "AI黄埔学院-太原站",
    date: "2026年5月30日",
    location: "山西太原，文旅大厦",
    attendees: "50+",
    summary:
      "两天高强度线下实操课，多位导师倾囊传授；从认知提升到行业投资逻辑；从基础知识到提示词实操；从工作中的提效工具到VibeCoding的实操项目；每位导师都用自己实际做出的项目做例子，和学员深度互动，手把手教学。充实的两天很快结束，大家反响积极，期待下次太原继续开班。",
    highlights: ["多位导师手把手教学", "提示词实操训练", "VibeCoding 实战项目", "学员反响积极"],
    image: runtimeAssetOrFallback(
      "/manus-storage/activity-taiyuan_b0f43bd3.webp",
      EVENT_PLACEHOLDER,
    ),
  },
  {
    id: 2,
    tag: "OpenClaw中国行",
    tagColor: "#1a56db",
    title: "OpenClaw Web4.0中国行·太原站",
    date: "2026年3月29日",
    location: "山西太原，超自然数字文化中心",
    attendees: "400+",
    summary:
      "人气爆棚！OpenClaw太原站现场座无虚席，400人齐聚一堂，共探Web4.0新机遇！全场聚焦Web4.0，现场氛围直接拉满！",
    highlights: ["400人齐聚一堂", "座无虚席", "聚焦Web4.0新机遇", "现场氛围爆棚"],
    image: runtimeAssetOrFallback(
      "/manus-storage/activity-openclaw-taiyuan_2da526f3.jpg",
      EVENT_PLACEHOLDER,
    ),
  },
  {
    id: 3,
    tag: "结业典礼",
    tagColor: "#c42a21",
    title: "AI 黄埔学院 2025 春季班结业典礼",
    date: "2025年2月28日",
    location: "北京·朝阳区",
    attendees: "200+",
    summary:
      "2025 春季班 200 余名学员圆满完成全周期学习，在结业典礼上接受导师颁发的认证证书。典礼上多位优秀学员分享了 AI 赋能职场的真实案例，多家合作企业现场发出录用邀请，现场气氛热烈感人。",
    highlights: ["200+ 学员结业", "优秀学员案例分享", "企业现场抛出 offer", "终身校友资格激活"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/activity-graduation-AoG6hRDdNsrvFEFLvrwNFB.webp",
  },
  {
    id: 4,
    tag: "行业交流",
    tagColor: "#059669",
    title: "AI 黄埔校友·产业资源对接交流会",
    date: "2025年1月15日",
    location: "深圳·南山科技园",
    attendees: "300+",
    summary:
      "AI 黄埔学院联合 30 余家科技企业举办校友资源对接会，为学员提供实习、就业、创业投资等多维度机会。现场设 AI 产品展示区、投融资对接专区与校友创业展台，多个校友项目当场获得意向投资。",
    highlights: ["30+ 合作企业参展", "100+ 岗位现场招募", "5 个校友项目获投资意向", "创业孵化专项通道开放"],
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/activity-networking-Hpp9y9U5CrQe3S7ZnJwXzU.webp",
  },
];

export default function Activities() {
  const [lightbox, setLightbox] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-white">
      {/* ── Navbar ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0f1a]/95 backdrop-blur-md border-b border-white/10">
        <div className="container flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2.5 group">
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
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-white/60 hover:text-white text-sm transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回首页
          </Link>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="pt-16 md:pt-20 bg-[#0a0f1a] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#E63329]/10 via-transparent to-transparent" />
        <div className="container py-16 md:py-24 relative z-10">
          <div className="inline-flex items-center gap-2 bg-[#E63329]/10 border border-[#E63329]/30 rounded-full px-4 py-1.5 mb-6">
            <span className="w-2 h-2 bg-[#E63329] rounded-full animate-pulse" />
            <span className="text-[#E63329] text-sm font-semibold">往期活动回顾</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            每一次相聚<br />
            <span className="text-[#E63329]">都是成长的印记</span>
          </h1>
          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            从峰会到工作坊，从结业典礼到校友交流，AI 黄埔学院用一场场活动，
            连接人才与机遇，锻造 AI 时代的铁军精英。
          </p>
          {/* Stats */}
          <div className="flex flex-wrap gap-8 mt-10">
            {[
              { value: "20+", label: "年度活动" },
              { value: "5000+", label: "参与人次" },
              { value: "30+", label: "合作企业" },
              { value: "全国", label: "城市覆盖" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-white" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  {s.value}
                </div>
                <div className="text-white/40 text-sm mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Activity Cards ── */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container">
          <div className="space-y-12">
            {activities.map((act, i) => (
              <article
                key={act.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 ${i % 2 === 1 ? "lg:grid-flow-dense" : ""}`}>
                  {/* Image */}
                  <div
                    className={`relative overflow-hidden cursor-zoom-in ${i % 2 === 1 ? "lg:col-start-2" : ""}`}
                    onClick={() => setLightbox(act.image)}
                  >
                    <img
                      src={act.image}
                      alt={act.title}
                      className="w-full h-64 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span
                        className="text-white text-xs font-bold px-3 py-1.5 rounded-full"
                        style={{ backgroundColor: act.tagColor }}
                      >
                        {act.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-10 flex flex-col justify-center">
                    <h2 className="text-xl md:text-2xl font-black text-gray-900 mb-4 leading-snug" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                      {act.title}
                    </h2>

                    {/* Meta */}
                    <div className="flex flex-wrap gap-4 mb-5">
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Calendar className="w-4 h-4 text-[#E63329]" />
                        {act.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <MapPin className="w-4 h-4 text-[#E63329]" />
                        {act.location}
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                        <Users className="w-4 h-4 text-[#E63329]" />
                        {act.attendeesLabel ?? `参与人数 ${act.attendees} 人`}
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">{act.summary}</p>

                    {/* Highlights */}
                    <div className="grid grid-cols-2 gap-2">
                      {act.highlights.map((h) => (
                        <div key={h} className="flex items-center gap-2 text-sm text-gray-700">
                          <ChevronRight className="w-3.5 h-3.5 text-[#E63329] flex-shrink-0" />
                          {h}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-16 bg-[#0a0f1a]">
        <div className="container text-center">
          <h2 className="text-2xl md:text-4xl font-black text-white mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            下一场活动，期待你的参与
          </h2>
          <p className="text-white/50 mb-8 max-w-xl mx-auto">
            关注 AI 黄埔学院，第一时间获取最新活动资讯与报名通道
          </p>
          <Link
            href="/#contact"
            className="inline-block px-10 py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white font-bold text-base rounded-lg transition-all duration-200 shadow-lg shadow-[#E63329]/30"
          >
            立即预约报名
          </Link>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-[#080C12] border-t border-white/10 py-8">
        <div className="container text-center text-white/30 text-sm">
          © 2025 AI 黄埔学院. 保留所有权利.
        </div>
      </footer>

      {/* ── Lightbox ── */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white"
            onClick={() => setLightbox(null)}
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox}
            alt="活动图片"
            className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
