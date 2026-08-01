import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Sparkles, Users, X } from "lucide-react";

const EVENT_DETAIL_URL =
  "https://www.huodongxing.com/event/1866531327000?utm_source=%e6%90%9c%e7%b4%a2%e6%b4%bb%e5%8a%a8%e5%88%97%e8%a1%a8%e9%a1%b5&utm_medium=&utm_campaign=searchpage";

const eventInfo = {
  name: "晋阳星途·青少年AI黑客松",
  time: "2026年7月11日 09:00 - 7月12日 18:00",
  age: "8-16岁青少年",
  location: "山西·太原",
  slogan: "青春无畏，创想无限",
};

export default function TaiyuanEventPopup() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4 py-6">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-black/65 backdrop-blur-sm"
        onClick={() => setIsOpen(false)}
      />

      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="taiyuan-event-title"
        className="relative w-full max-w-[calc(100vw-2rem)] sm:max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0a0f1a] text-white shadow-2xl"
      >
        <div className="h-1 w-full bg-gradient-to-r from-[#E63329] via-[#ff7a45] to-[#E63329]" />

        <button
          type="button"
          aria-label="关闭"
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white/70 transition-colors hover:bg-white/15 hover:text-white focus:outline-none focus:ring-2 focus:ring-[#E63329]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-6 pb-7 pt-8 sm:px-8 sm:pb-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#E63329]/40 bg-[#E63329]/15 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5 text-[#E63329]" />
            <span className="text-xs font-bold tracking-wider text-[#E63329]">
              太原暑期赛季
            </span>
          </div>

          <p className="mb-3 text-sm font-semibold text-white/60">{eventInfo.slogan}</p>
          <h2
            id="taiyuan-event-title"
            className="text-xl font-black leading-snug sm:text-3xl sm:leading-tight"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {eventInfo.name}
          </h2>

          <div className="mt-6 grid gap-3">
            <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
              <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#E63329]" />
              <div>
                <div className="text-xs font-semibold text-white/40">时间</div>
                <div className="mt-0.5 text-sm font-medium leading-5 text-white/85">
                  {eventInfo.time}
                </div>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#E63329]" />
                <div>
                  <div className="text-xs font-semibold text-white/40">年龄</div>
                  <div className="mt-0.5 text-sm font-medium text-white/85">
                    {eventInfo.age}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#E63329]" />
                <div>
                  <div className="text-xs font-semibold text-white/40">地点</div>
                  <div className="mt-0.5 text-sm font-medium text-white/85">
                    {eventInfo.location}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <a
            href={EVENT_DETAIL_URL}
            className="mt-6 flex w-full items-center justify-center rounded-xl bg-[#E63329] px-5 py-3.5 text-base font-bold text-white shadow-lg shadow-[#E63329]/30 transition-colors hover:bg-[#c42a21] focus:outline-none focus:ring-2 focus:ring-[#E63329] focus:ring-offset-2 focus:ring-offset-[#0a0f1a]"
          >
            查看详情
          </a>
        </div>
      </section>
    </div>
  );
}
