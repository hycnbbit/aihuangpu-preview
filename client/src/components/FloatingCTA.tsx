import { ArrowUpRight, MessageSquare } from "lucide-react";
import { useEffect, useState } from "react";

export default function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 520);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#contact"
      className="group fixed bottom-5 right-5 z-40 hidden items-center gap-2 rounded-full border border-[#78d6c4]/35 bg-[#07151d]/92 px-4 py-3 text-xs font-bold text-[#f7f1e5] shadow-[0_12px_40px_rgba(0,0,0,.22)] backdrop-blur md:flex"
    >
      <MessageSquare className="h-4 w-4 text-[#ffb84d]" />
      预约咨询
      <ArrowUpRight className="h-3.5 w-3.5 text-[#78d6c4] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
    </a>
  );
}
