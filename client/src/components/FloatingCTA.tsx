/*
 * FloatingCTA — AI 黄埔学院
 * 风格：右下角浮动咨询按钮，滚动后显示
 */
import { useState, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-8 right-6 z-50 flex flex-col items-end gap-3">
      {/* Expanded panel */}
      {expanded && (
        <div className="bg-white rounded-2xl shadow-2xl p-5 w-64 border border-gray-100 animate-fade-in-up">
          <h4 className="font-black text-gray-900 text-sm mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            免费获取课程方案
          </h4>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            专属顾问 24 小时内回复，赠送试听名额
          </p>
          <button
            onClick={() => {
              setExpanded(false);
              document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full py-2.5 bg-[#E63329] hover:bg-[#c42a21] text-white text-sm font-semibold rounded-lg transition-all active:scale-95"
          >
            立即咨询
          </button>
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-14 h-14 bg-[#E63329] hover:bg-[#c42a21] text-white rounded-full shadow-lg shadow-[#E63329]/40 flex items-center justify-center transition-all duration-200 active:scale-95 btn-pulse"
      >
        {expanded ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
