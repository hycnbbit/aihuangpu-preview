import { ArrowUpRight, Play, Users } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "wouter";
import type { StudentWork } from "@/lib/studentWorks";

type StudentWorkCardProps = {
  work: StudentWork;
  index?: number;
  compact?: boolean;
};

function WorkCover({
  work,
  compact = false,
}: {
  work: StudentWork;
  compact?: boolean;
}) {
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <div
      className={`relative overflow-hidden bg-[#10232b] ${compact ? "aspect-[1.35]" : "aspect-[1.25]"}`}
      style={{ backgroundColor: work.accentSoft }}
    >
      {work.cover && !coverFailed ? (
        <img
          src={work.cover}
          alt={`${work.title} 作品封面`}
          loading="eager"
          decoding="async"
          onError={() => setCoverFailed(true)}
          className="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.055]"
        />
      ) : (
        <div className="flex h-full w-full flex-col justify-between bg-[radial-gradient(circle_at_76%_18%,rgba(255,255,255,.16),transparent_24%)] p-5 text-[#f8f3e8]">
          <span
            className="font-mono text-[10px] uppercase tracking-[0.25em]"
            style={{ color: work.accent }}
          >
            student work / playable
          </span>
          <span className="max-w-[90%] text-2xl font-semibold leading-tight">
            {work.title}
          </span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#07151d]/75 via-transparent to-transparent opacity-80" />
      <div className="absolute left-4 top-4 flex items-center gap-2">
        <span
          className="rounded-full px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[#08151b]"
          style={{ backgroundColor: work.accent }}
        >
          {work.category}
        </span>
      </div>
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3 text-white">
        <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-white/75">
          <Play className="h-3 w-3 fill-current" />
          {work.projectCount > 1 ? `${work.projectCount} 个入口` : "立即试玩"}
        </span>
        <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/15 backdrop-blur transition group-hover:-translate-y-1 group-hover:border-white/80">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </div>
  );
}

export default function StudentWorkCard({
  work,
  index = 0,
  compact = false,
}: StudentWorkCardProps) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.045, 0.28),
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -6 }}
      className={`group overflow-hidden border border-white/10 bg-[#10232b] shadow-[0_18px_55px_rgba(0,0,0,.14)] ${compact ? "rounded-[1.25rem]" : "rounded-[1.5rem]"}`}
    >
      <Link
        href={`/showcase/${work.slug}`}
        className="block h-full"
        aria-label={`查看${work.title}作品详情`}
      >
        <WorkCover work={work} compact={compact} />
        <div className={`${compact ? "p-4" : "p-5"} bg-[#10232b]`}>
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3
              className={`${compact ? "text-lg" : "text-xl"} font-semibold leading-tight tracking-[-0.02em] text-[#f7f1e5]`}
            >
              {work.title}
            </h3>
            <span className="shrink-0 font-mono text-[10px] text-white/35">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
          <p className="mb-4 line-clamp-2 text-sm leading-6 text-white/55">
            {work.description}
          </p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-white/45">
            <span className="flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" />
              {work.authorLabel}
            </span>
            <span className="font-mono uppercase tracking-[0.14em] text-white/30">
              {work.tags.slice(0, 2).join(" / ")}
            </span>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export { WorkCover };
