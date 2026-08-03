import { useState } from "react";
import { Phone, MapPin, Clock, ChevronDown, X, MessageCircle, Star, Users, Utensils, CalendarCheck } from "lucide-react";
import { toast } from "sonner";

const IMAGES = {
  hero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/yuanji-hero-mujdRq44VQogsjQc8hxgSk.webp",
  food1: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/yuanji-food1-DWzNyxHeuQTmUKXz9pNBw4.webp",
  food2: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/yuanji-food2-jZNMyMBhqtHtVjUAfCFoi3.webp",
  food3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/yuanji-food3-Yh76fq45zpeH9er6q9Hvvy.webp",
  interior: "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/yuanji-interior-BMLWGCNdsA9vPrAsUMmZ2s.webp",
};

const MENU_ITEMS = [
  { category: "招牌荤串", items: [
    { name: "嫩牛肉串", price: "3元/串", spicy: 3, desc: "精选黄牛腱子肉，嫩滑多汁" },
    { name: "毛肚串", price: "4元/串", spicy: 2, desc: "新鲜毛肚，口感脆爽" },
    { name: "鸭肠串", price: "3元/串", spicy: 2, desc: "现穿鸭肠，香辣入味" },
    { name: "虾滑串", price: "5元/串", spicy: 1, desc: "新鲜虾仁手工制作" },
  ]},
  { category: "素菜精选", items: [
    { name: "莲藕片", price: "1元/串", spicy: 1, desc: "脆嫩莲藕，清爽解辣" },
    { name: "金针菇", price: "1元/串", spicy: 1, desc: "嫩滑金针菇，吸汁入味" },
    { name: "豆皮卷", price: "1元/串", spicy: 2, desc: "薄脆豆皮，香辣可口" },
    { name: "土豆片", price: "1元/串", spicy: 1, desc: "绵软土豆，百吃不厌" },
  ]},
  { category: "特色豆制品", items: [
    { name: "老豆腐", price: "1元/串", spicy: 1, desc: "嫩滑豆腐，吸饱汤汁" },
    { name: "豆干串", price: "1元/串", spicy: 2, desc: "五香豆干，嚼劲十足" },
    { name: "腐竹卷", price: "2元/串", spicy: 1, desc: "薄脆腐竹，香气浓郁" },
    { name: "魔芋串", price: "1元/串", spicy: 1, desc: "低卡魔芋，弹牙爽口" },
  ]},
];

const REVIEWS = [
  { name: "张**", rating: 5, text: "串串超级好吃！汤底麻辣鲜香，牛肉嫩滑，毛肚脆爽，性价比很高，下次还来！", date: "2026-05-10" },
  { name: "李**", rating: 5, text: "环境很好，服务热情，串串种类丰富，朋友聚餐首选！", date: "2026-05-08" },
  { name: "王**", rating: 4, text: "味道正宗，汤底很香，就是周末人有点多，建议提前预约。", date: "2026-05-05" },
  { name: "赵**", rating: 5, text: "袁记的串串是我吃过最好吃的！每次来都要点一大堆，强烈推荐！", date: "2026-04-28" },
];

type ReservationForm = {
  name: string;
  phone: string;
  date: string;
  time: string;
  guests: string;
  remark: string;
};

export default function YuanjiRestaurant() {
  const [activeMenu, setActiveMenu] = useState(0);
  const [showReservation, setShowReservation] = useState(false);
  const [showService, setShowService] = useState(false);
  const [form, setForm] = useState<ReservationForm>({
    name: "", phone: "", date: "", time: "", guests: "2", remark: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.date || !form.time) {
      toast.error("请填写完整预定信息");
      return;
    }
    setSubmitted(true);
    toast.success("预定成功！我们会尽快与您确认");
  };

  return (
    <div className="min-h-screen bg-[#1a0a00] text-white font-sans">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#1a0a00]/90 backdrop-blur-md border-b border-[#8B1A1A]/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4380D] to-[#8B1A1A] flex items-center justify-center text-white font-bold text-lg">袁</div>
            <div>
              <div className="font-bold text-lg text-[#F5C842] leading-tight">袁记串串香</div>
              <div className="text-xs text-white/50">安新店</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm text-white/70">
            <a href="#about" className="hover:text-[#F5C842] transition-colors">关于我们</a>
            <a href="#menu" className="hover:text-[#F5C842] transition-colors">特色菜单</a>
            <a href="#gallery" className="hover:text-[#F5C842] transition-colors">餐厅环境</a>
            <a href="#reviews" className="hover:text-[#F5C842] transition-colors">顾客评价</a>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowReservation(true)}
              className="px-4 py-2 bg-[#D4380D] hover:bg-[#B52E0A] text-white text-sm rounded-full transition-all active:scale-95"
            >
              立即预定
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <img src={IMAGES.hero} alt="袁记串串香" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0a00]/60 via-transparent to-[#1a0a00]" />
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <div className="inline-block px-4 py-1 bg-[#D4380D]/80 rounded-full text-sm mb-4 text-white/90">
            🌶️ 正宗四川串串香 · 安新店
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-4 leading-tight">
            <span className="text-[#F5C842]">袁记</span>串串香
          </h1>
          <p className="text-xl md:text-2xl text-white/80 mb-2">麻辣鲜香，一串入魂</p>
          <p className="text-white/60 mb-8 text-sm md:text-base">精选食材 · 秘制汤底 · 百余种串串 · 欢迎光临</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setShowReservation(true)}
              className="px-8 py-3 bg-[#D4380D] hover:bg-[#B52E0A] text-white rounded-full font-semibold text-lg transition-all active:scale-95 shadow-lg shadow-[#D4380D]/30"
            >
              在线预定餐位
            </button>
            <button
              onClick={() => setShowService(true)}
              className="px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-semibold text-lg transition-all active:scale-95 backdrop-blur-sm border border-white/20"
            >
              联系客服
            </button>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 bg-[#2a0f00]">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: <Utensils className="w-6 h-6" />, value: "100+", label: "串串种类" },
            { icon: <Star className="w-6 h-6" />, value: "4.9", label: "顾客评分" },
            { icon: <Users className="w-6 h-6" />, value: "5000+", label: "月均接待" },
            { icon: <CalendarCheck className="w-6 h-6" />, value: "10年+", label: "品牌历史" },
          ].map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="text-[#D4380D]">{s.icon}</div>
              <div className="text-2xl font-bold text-[#F5C842]">{s.value}</div>
              <div className="text-white/50 text-sm">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-20 max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="text-[#D4380D] text-sm font-semibold mb-2 uppercase tracking-widest">关于我们</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5C842] mb-6">传承正宗川味<br />匠心串串之道</h2>
            <p className="text-white/70 mb-4 leading-relaxed">
              袁记串串香安新店，传承正宗四川串串香制作工艺，选用当日新鲜食材，搭配秘制麻辣汤底，每一串都是对味蕾的极致诱惑。
            </p>
            <p className="text-white/70 mb-6 leading-relaxed">
              我们坚持"食材新鲜、汤底纯正、服务用心"的经营理念，为每一位到来的顾客提供最地道的川味串串体验。无论是家庭聚餐、朋友小聚还是商务宴请，袁记串串香都是您的不二之选。
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "营业时间", value: "11:00 - 23:00" },
                { label: "人均消费", value: "约 60-80 元" },
                { label: "停车", value: "门前免费停车" },
                { label: "包间", value: "4个包间可预定" },
              ].map((item, i) => (
                <div key={i} className="bg-white/5 rounded-xl p-3 border border-white/10">
                  <div className="text-white/40 text-xs mb-1">{item.label}</div>
                  <div className="text-white text-sm font-medium">{item.value}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img
              src={IMAGES.food1}
              alt="招牌串串"
              className="rounded-2xl w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(IMAGES.food1)}
            />
            <img
              src={IMAGES.food3}
              alt="麻辣汤底"
              className="rounded-2xl w-full h-48 object-cover mt-6 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(IMAGES.food3)}
            />
            <img
              src={IMAGES.food2}
              alt="串串全家福"
              className="rounded-2xl w-full h-48 object-cover col-span-2 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() => setLightbox(IMAGES.food2)}
            />
          </div>
        </div>
      </section>

      {/* Menu */}
      <section id="menu" className="py-20 bg-[#2a0f00]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#D4380D] text-sm font-semibold mb-2 uppercase tracking-widest">特色菜单</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5C842]">百余种串串，任君挑选</h2>
          </div>
          <div className="flex gap-3 mb-8 justify-center flex-wrap">
            {MENU_ITEMS.map((cat, i) => (
              <button
                key={i}
                onClick={() => setActiveMenu(i)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeMenu === i
                    ? "bg-[#D4380D] text-white"
                    : "bg-white/10 text-white/60 hover:bg-white/20"
                }`}
              >
                {cat.category}
              </button>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {MENU_ITEMS[activeMenu].items.map((item, i) => (
              <div key={i} className="bg-[#1a0a00] rounded-2xl p-5 border border-white/10 hover:border-[#D4380D]/50 transition-all">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-white">{item.name}</h3>
                  <span className="text-[#F5C842] font-bold text-sm">{item.price}</span>
                </div>
                <p className="text-white/50 text-xs mb-3">{item.desc}</p>
                <div className="flex gap-0.5">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <span key={j} className={`text-sm ${j < item.spicy ? "text-[#D4380D]" : "text-white/20"}`}>🌶️</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-6">以上为部分菜品展示，实际菜单以店内为准</p>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="py-20 max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="text-[#D4380D] text-sm font-semibold mb-2 uppercase tracking-widest">餐厅环境</div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#F5C842]">温馨舒适的用餐空间</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[IMAGES.hero, IMAGES.interior, IMAGES.food2, IMAGES.food1, IMAGES.food3, IMAGES.interior].map((img, i) => (
            <div
              key={i}
              className={`overflow-hidden rounded-2xl cursor-pointer group ${i === 0 || i === 3 ? "md:col-span-1" : ""}`}
              onClick={() => setLightbox(img)}
            >
              <img
                src={img}
                alt={`餐厅图片${i + 1}`}
                className="w-full h-48 md:h-56 object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Reviews */}
      <section id="reviews" className="py-20 bg-[#2a0f00]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="text-[#D4380D] text-sm font-semibold mb-2 uppercase tracking-widest">顾客评价</div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#F5C842]">顾客的口碑是最好的证明</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {REVIEWS.map((r, i) => (
              <div key={i} className="bg-[#1a0a00] rounded-2xl p-5 border border-white/10">
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: r.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#F5C842] text-[#F5C842]" />
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-4">"{r.text}"</p>
                <div className="flex justify-between items-center text-xs text-white/30">
                  <span>{r.name}</span>
                  <span>{r.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-16 max-w-6xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#2a0f00] to-[#3a1500] rounded-3xl p-8 md:p-12 border border-[#D4380D]/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#F5C842] mb-6">来店信息</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#D4380D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">地址</div>
                    <div className="text-white">河北省保定市安新县（模拟地址，请替换为真实地址）</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#D4380D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">预定电话</div>
                    <div className="text-white">138-XXXX-XXXX（请替换为真实电话）</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#D4380D] mt-0.5 shrink-0" />
                  <div>
                    <div className="text-white/40 text-xs mb-0.5">营业时间</div>
                    <div className="text-white">每日 11:00 – 23:00（全年无休）</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setShowReservation(true)}
                className="w-full py-4 bg-[#D4380D] hover:bg-[#B52E0A] text-white rounded-2xl font-semibold text-lg transition-all active:scale-95"
              >
                🍢 立即在线预定餐位
              </button>
              <button
                onClick={() => setShowService(true)}
                className="w-full py-4 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-semibold text-lg transition-all active:scale-95 border border-white/20"
              >
                💬 联系客服咨询
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/10 text-center text-white/30 text-sm">
        <p>© 2026 袁记串串香安新店 · 麻辣鲜香，一串入魂</p>
      </footer>

      {/* Reservation Modal */}
      {showReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a0a00] border border-[#D4380D]/30 rounded-3xl w-full max-w-md p-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => { setShowReservation(false); setSubmitted(false); }}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🎉</div>
                <h3 className="text-xl font-bold text-[#F5C842] mb-2">预定成功！</h3>
                <p className="text-white/60 text-sm mb-2">我们已收到您的预定信息</p>
                <p className="text-white/60 text-sm mb-6">工作人员将在30分钟内致电确认，请保持电话畅通</p>
                <div className="bg-white/5 rounded-xl p-4 text-left text-sm space-y-2 mb-6">
                  <div className="flex justify-between"><span className="text-white/40">姓名</span><span className="text-white">{form.name}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">电话</span><span className="text-white">{form.phone}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">日期</span><span className="text-white">{form.date}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">时间</span><span className="text-white">{form.time}</span></div>
                  <div className="flex justify-between"><span className="text-white/40">人数</span><span className="text-white">{form.guests}人</span></div>
                </div>
                <button
                  onClick={() => { setShowReservation(false); setSubmitted(false); }}
                  className="w-full py-3 bg-[#D4380D] text-white rounded-xl font-semibold"
                >
                  确认
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold text-[#F5C842] mb-6">在线预定餐位</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">您的姓名 *</label>
                    <input
                      type="text"
                      placeholder="请输入姓名"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4380D] text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">联系电话 *</label>
                    <input
                      type="tel"
                      placeholder="请输入手机号"
                      value={form.phone}
                      onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4380D] text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-white/60 text-xs mb-1 block">就餐日期 *</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4380D] text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-white/60 text-xs mb-1 block">就餐时间 *</label>
                      <select
                        value={form.time}
                        onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                        className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4380D] text-sm"
                      >
                        <option value="" className="bg-[#1a0a00]">选择时间</option>
                        {["11:00","11:30","12:00","12:30","13:00","17:00","17:30","18:00","18:30","19:00","19:30","20:00","20:30","21:00"].map(t => (
                          <option key={t} value={t} className="bg-[#1a0a00]">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">就餐人数</label>
                    <select
                      value={form.guests}
                      onChange={e => setForm(f => ({ ...f, guests: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#D4380D] text-sm"
                    >
                      {["1","2","3","4","5","6","7","8","8人以上"].map(n => (
                        <option key={n} value={n} className="bg-[#1a0a00]">{n}人</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-white/60 text-xs mb-1 block">备注（特殊需求、包间需求等）</label>
                    <textarea
                      placeholder="如需包间请在此说明，或有其他特殊需求..."
                      value={form.remark}
                      onChange={e => setForm(f => ({ ...f, remark: e.target.value }))}
                      rows={3}
                      className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#D4380D] text-sm resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 bg-[#D4380D] hover:bg-[#B52E0A] text-white rounded-xl font-semibold transition-all active:scale-95"
                  >
                    确认预定
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}

      {/* Customer Service Modal */}
      {showService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#1a0a00] border border-[#D4380D]/30 rounded-3xl w-full max-w-sm p-6 relative">
            <button
              onClick={() => setShowService(false)}
              className="absolute top-4 right-4 text-white/40 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center mb-6">
              <div className="w-14 h-14 bg-[#D4380D]/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="w-7 h-7 text-[#D4380D]" />
              </div>
              <h3 className="text-xl font-bold text-[#F5C842]">联系客服</h3>
              <p className="text-white/50 text-sm mt-1">我们随时为您服务</p>
            </div>
            <div className="space-y-3">
              <a
                href="tel:138XXXXXXXX"
                className="flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl p-4 transition-all"
              >
                <div className="w-10 h-10 bg-[#D4380D]/20 rounded-full flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#D4380D]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">电话咨询</div>
                  <div className="text-white/40 text-xs">138-XXXX-XXXX（请替换为真实电话）</div>
                </div>
              </a>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 bg-[#07C160]/20 rounded-full flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 text-[#07C160]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">微信咨询</div>
                  <div className="text-white/40 text-xs">微信号：yuanji_anxin（请替换为真实微信）</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="w-10 h-10 bg-[#F5C842]/20 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-[#F5C842]" />
                </div>
                <div>
                  <div className="text-white font-medium text-sm">服务时间</div>
                  <div className="text-white/40 text-xs">每日 10:00 – 22:00</div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowReservation(true)}
              className="w-full mt-4 py-3 bg-[#D4380D] hover:bg-[#B52E0A] text-white rounded-xl font-semibold transition-all active:scale-95"
            >
              直接在线预定
            </button>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-4 right-4 text-white/60 hover:text-white">
            <X className="w-8 h-8" />
          </button>
          <img
            src={lightbox}
            alt="大图预览"
            className="max-w-full max-h-full rounded-2xl object-contain"
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
        <button
          onClick={() => setShowService(true)}
          className="w-12 h-12 bg-[#07C160] hover:bg-[#06A84F] text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
          title="联系客服"
        >
          <MessageCircle className="w-5 h-5" />
        </button>
        <button
          onClick={() => setShowReservation(true)}
          className="w-12 h-12 bg-[#D4380D] hover:bg-[#B52E0A] text-white rounded-full shadow-lg flex items-center justify-center transition-all active:scale-95"
          title="立即预定"
        >
          <CalendarCheck className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
