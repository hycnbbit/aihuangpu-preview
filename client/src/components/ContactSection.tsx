/*
 * ContactSection — AI 黄埔学院
 * 风格：红色渐变背景，咨询表单，强力 CTA
 */
import { useEffect, useRef, useState } from "react";
import { Mail, MapPin, Send, CheckCircle } from "lucide-react";

const courseOptions = [
  "小白入门班",
  "职场精英班",
  "企业家 / 管理者班",
  "青少年 AI 科创班",
  "企业内训定制",
  "其他咨询",
];

export default function ContactSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", course: "", message: "" });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate submission
    setTimeout(() => setSubmitted(true), 500);
  };

  return (
    <section id="contact" className="py-20 bg-[#0D1117] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E63329]/10 via-transparent to-transparent" />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E63329] to-transparent" />

      <div ref={ref} className="container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left: Info */}
          <div className={`scroll-reveal ${visible ? "visible" : ""}`}>
            <div className="inline-flex items-center gap-2 bg-[#E63329]/20 border border-[#E63329]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#E63329] rounded-full animate-pulse" />
              <span className="text-[#E63329] text-sm font-semibold">立即咨询</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              获取专属课程方案
              <br />
              <span className="text-[#E63329]">与试听名额</span>
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10">
              填写右侧表单，我们的专属顾问将在 24 小时内与您联系，
              为您量身定制最适合的 AI 学习路径。
            </p>

            {/* Contact Info */}
            <div className="space-y-4">
              {[
                { icon: Mail, label: "邮箱", value: "contact@aihuangpu.ai" },
                { icon: MapPin, label: "总部地址", value: "深圳市福田区" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#E63329]/20 rounded-xl flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#E63329]" />
                    </div>
                    <div>
                      <div className="text-white/40 text-xs">{item.label}</div>
                      <div className="text-white font-medium text-sm">{item.value}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* WeChat QR Code */}
            <div className="mt-8 bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center gap-6">
              <img
                src="/manus-storage/wechat-qrcode_e6ff045c.jpg"
                alt="微信二维码"
                className="w-28 h-28 rounded-xl object-cover shrink-0 bg-white p-1"
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <svg className="w-5 h-5 text-[#07C160]" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-3.518 3.597c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982zm4.845 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z"/>
                  </svg>
                  <span className="text-white font-bold text-base">微信扫码咨询</span>
                </div>
                <p className="text-white/50 text-sm leading-relaxed">扫描二维码添加微信，<br />获取专属课程方案</p>
              </div>
            </div>

            {/* Promise */}
            <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-6">
              <h4 className="text-white font-bold mb-3">咨询承诺</h4>
              {[
                "24 小时内专属顾问回复",
                "免费提供个性化学习方案",
                "赠送精品试听课程名额",
                "无任何强制消费压力",
              ].map((p) => (
                <div key={p} className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-[#E63329] shrink-0" />
                  <span className="text-white/70 text-sm">{p}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Form */}
          <div className={`scroll-reveal ${visible ? "visible" : ""}`} style={{ transitionDelay: "200ms" }}>
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    提交成功！
                  </h3>
                  <p className="text-gray-500 text-sm">
                    感谢您的咨询，我们的顾问将在 24 小时内与您联系。
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-6 px-6 py-2 bg-[#E63329] text-white rounded-lg text-sm font-semibold hover:bg-[#c42a21] transition-colors"
                  >
                    再次咨询
                  </button>
                </div>
              ) : (
                <>
                  <h3 className="text-xl font-black text-gray-900 mb-6" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                    填写咨询信息
                  </h3>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        您的姓名 <span className="text-[#E63329]">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="请输入您的姓名"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E63329] focus:ring-2 focus:ring-[#E63329]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        联系电话 <span className="text-[#E63329]">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="请输入您的手机号"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E63329] focus:ring-2 focus:ring-[#E63329]/20 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        感兴趣的课程
                      </label>
                      <select
                        value={form.course}
                        onChange={(e) => setForm({ ...form, course: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E63329] focus:ring-2 focus:ring-[#E63329]/20 transition-all bg-white"
                      >
                        <option value="">请选择课程类型</option>
                        {courseOptions.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                        补充说明
                      </label>
                      <textarea
                        rows={3}
                        placeholder="请描述您的学习需求或问题..."
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#E63329] focus:ring-2 focus:ring-[#E63329]/20 transition-all resize-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#E63329] hover:bg-[#c42a21] active:scale-[0.98] text-white font-bold text-base rounded-lg transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#E63329]/30"
                    >
                      <Send className="w-5 h-5" />
                      立即获取专属方案
                    </button>
                    <p className="text-gray-400 text-xs text-center">
                      提交即代表您同意我们的隐私政策，我们承诺不会泄露您的个人信息
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
