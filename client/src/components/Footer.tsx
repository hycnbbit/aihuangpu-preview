/*
 * Footer — AI 黄埔学院
 * 风格：深色背景，简洁信息，版权声明
 */
import { Zap } from "lucide-react";

const footerLinks = [
  {
    title: "课程体系",
    links: ["小白入门班", "职场精英班", "企业家管理者班", "青少年 AI 科创班", "企业内训定制"],
  },
  {
    title: "核心优势",
    links: ["体系最完整", "师资最硬核", "教学最实战", "服务最全面", "生态最强大"],
  },
  {
    title: "关于我们",
    links: ["品牌介绍", "使命愿景", "师资团队", "合作企业", "加入我们"],
  },
  {
    title: "联系方式",
    links: ["在线咨询", "contact@aihuangpu.ai", "深圳市福田区", "微信公众号"],
  },
];

export default function Footer() {
  const handleNavClick = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <footer className="bg-[#080C12] border-t border-white/10">
      <div className="container py-14">
        {/* Top */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-[#E63329] rounded-sm flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-white font-bold text-base" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                  AI 黄埔学院
                </span>
                <span className="text-[#E63329] text-[10px] tracking-widest font-medium">
                  AI HUANGPU ACADEMY
                </span>
              </div>
            </div>
            <p className="text-white/40 text-sm leading-relaxed">
              中国 AI 垂直培训领军品牌，让人人掌握 AI，让 AI 成就未来。
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-white font-semibold text-sm mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link}>
                    <span className="text-white/40 hover:text-white/70 text-sm transition-colors cursor-pointer">
                      {link}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-sm">
            © 2025 AI 黄埔学院. 保留所有权利.
          </p>
          <div className="flex items-center gap-6">
            {["隐私政策", "服务条款", "关于我们"].map((item) => (
              <span key={item} className="text-white/30 hover:text-white/60 text-sm transition-colors cursor-pointer">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
