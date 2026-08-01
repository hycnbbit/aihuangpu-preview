/*
 * AnnouncementModal — AI 黄埔学院
 * 首页进入时自动弹出活动公告，3 秒后可关闭，点击"了解详情"跳转外链
 */
import { useState, useEffect } from "react";
import { X, MapPin, Calendar, Zap } from "lucide-react";

export default function AnnouncementModal() {
  const [visible, setVisible] = useState(false);
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    // 页面加载后 600ms 弹出，给 Hero 动画留出时间
    const showTimer = setTimeout(() => setVisible(true), 600);
    // 1.5 秒后允许关闭
    const closeTimer = setTimeout(() => setCanClose(true), 2100);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(closeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ animation: "fadeIn 0.3s ease-out" }}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => canClose && setVisible(false)}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-md bg-[#0a0f1a] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.23, 1, 0.32, 1)" }}
      >
        {/* Top accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-[#E63329] via-[#ff6b35] to-[#E63329]" />

        {/* Close button */}
        <button
          onClick={() => canClose && setVisible(false)}
          className={`absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-200 ${
            canClose
              ? "text-white/60 hover:text-white hover:bg-white/10 cursor-pointer"
              : "text-white/20 cursor-not-allowed"
          }`}
          title={canClose ? "关闭" : "请稍候…"}
        >
          <X className="w-4 h-4" />
        </button>

        {/* Content */}
        <div className="px-8 pt-8 pb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#E63329]/15 border border-[#E63329]/40 rounded-full px-3 py-1 mb-5">
            <span className="w-1.5 h-1.5 bg-[#E63329] rounded-full animate-pulse" />
            <span className="text-[#E63329] text-xs font-bold tracking-wider">最新活动公告</span>
          </div>

          {/* Icon */}
          <div className="w-14 h-14 bg-[#E63329] rounded-xl flex items-center justify-center mb-5 shadow-lg shadow-[#E63329]/30">
            <Zap className="w-7 h-7 text-white fill-white" />
          </div>

          {/* Headline */}
          <h2
            className="text-2xl font-black text-white leading-snug mb-4"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            5月30日和31日
            <br />
            <span className="text-[#E63329]">太原站</span>
          </h2>

          {/* Description */}
          <p className="text-white/70 text-base leading-relaxed mb-6">
            两天高强度 AI 线下实操课，手把手带你掌握 AI 核心技能，学完即用、即用即见效。
          </p>

          {/* Meta */}
          <div className="flex flex-col gap-2 mb-7">
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <Calendar className="w-4 h-4 text-[#E63329]" />
              <span>2026年5月30日 – 31日（周六、周日）</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-sm">
              <MapPin className="w-4 h-4 text-[#E63329]" />
              <span>山西·太原</span>
            </div>
          </div>

          {/* CTA */}
          <a
            href="https://www.huodongxing.com/event/5861345456800?td=2353581090099"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full py-3.5 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white text-center font-bold text-base rounded-xl transition-all duration-200 shadow-lg shadow-[#E63329]/30"
          >
            了解详情 →
          </a>

          {/* Skip */}
          <button
            onClick={() => canClose && setVisible(false)}
            className={`mt-3 w-full text-center text-sm transition-colors ${
              canClose ? "text-white/30 hover:text-white/60 cursor-pointer" : "text-white/15 cursor-not-allowed"
            }`}
          >
            {canClose ? "暂不感兴趣" : "稍候可关闭…"}
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px) scale(0.97); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
