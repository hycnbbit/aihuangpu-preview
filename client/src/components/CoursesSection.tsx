/*
 * CoursesSection — AI 黄埔学院
 * 风格：四大人群课程卡片，不对称布局，红色强调，悬停效果
 */
import { useEffect, useRef, useState } from "react";
import { Users, Briefcase, Building2, GraduationCap, CheckCircle2, ArrowRight } from "lucide-react";

const BEGINNER_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/course-beginner-UBnZKPBNcXvL7CQ8QnwYsN.webp";
const PROFESSIONAL_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/course-professional-covUdRUfvUCvP8MRxZHvZP.webp";
const ENTERPRISE_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/course-enterprise-Sc7ErGi8Qp2n8VZw2bpUms.webp";
const YOUTH_IMG = "https://d2xsxph8kpxj0f.cloudfront.net/310519663277454465/HfUetzfgCnqTKhifZV3Bis/course-youth-j2RYMpRWqMa8yEh83QpnBN.webp";

const courses = [
  {
    icon: Users,
    tag: "零基础",
    title: "小白入门班",
    subtitle: "0 基础也能快速上手 AI",
    duration: "7–15 天",
    color: "#E63329",
    bgColor: "from-red-50 to-white",
    image: BEGINNER_IMG,
    pain: "听不懂术语、不会工具、怕学不会",
    highlights: [
      "AI 通识与思维启蒙",
      "主流 AI 工具全流程实操",
      "零基础可复制的 AI 工作流",
      "副业变现入门与实战案例",
    ],
    outcome: "看得懂、用得会、做得快",
  },
  {
    icon: Briefcase,
    tag: "职场提升",
    title: "职场精英班",
    subtitle: "用 AI 提升效率，升职加薪快人一步",
    duration: "1 个月",
    color: "#1a56db",
    bgColor: "from-blue-50 to-white",
    image: PROFESSIONAL_IMG,
    pain: "加班多、效率低、竞争力弱",
    highlights: [
      "AI 自动化办公（文档/表格/PPT）",
      "AIGC 内容生产与爆款打造",
      "AI 数据分析与决策支持",
      "职场 AI 提效 SOP 与工具箱",
    ],
    outcome: "效率翻倍、成果出圈、晋升加速",
  },
  {
    icon: Building2,
    tag: "企业转型",
    title: "企业家 / 管理者班",
    subtitle: "AI 驱动增长，降本增效转型",
    duration: "定制周期",
    color: "#0e7c3a",
    bgColor: "from-green-50 to-white",
    image: ENTERPRISE_IMG,
    pain: "不懂 AI 如何落地、怕踩坑、缺方案",
    highlights: [
      "AI 战略与数字化转型顶层设计",
      "企业 AI 场景落地全方案",
      "大模型私有化部署与知识库",
      "AI 团队搭建与人才培养",
    ],
    outcome: "一套转型方案 + 一批 AI 骨干人才",
  },
  {
    icon: GraduationCap,
    tag: "青少年",
    title: "青少年 AI 科创班",
    subtitle: "从小培养 AI 素养，赢在未来",
    duration: "系统课程",
    color: "#9333ea",
    bgColor: "from-purple-50 to-white",
    image: YOUTH_IMG,
    pain: "兴趣难激发、知识太抽象、缺实战",
    highlights: [
      "AI 科普与伦理启蒙",
      "趣味编程与 AI 小项目",
      "科创竞赛与作品孵化",
      "科技视野与未来职业规划",
    ],
    outcome: "敢想敢创、动手能力强、具备核心竞争力",
  },
];

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = course.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`scroll-reveal ${visible ? "visible" : ""} card-hover bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col`}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div
          className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-xs font-bold"
          style={{ backgroundColor: course.color }}
        >
          {course.tag}
        </div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: course.color }}
          >
            <Icon className="w-4 h-4 text-white" />
          </div>
          <span className="text-white text-sm font-semibold">{course.duration}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          {course.title}
        </h3>
        <p className="text-sm text-gray-500 mb-3">{course.subtitle}</p>

        {/* Pain point */}
        <div className="bg-gray-50 rounded-lg px-3 py-2 mb-4 border-l-4" style={{ borderColor: course.color }}>
          <p className="text-xs text-gray-500 leading-relaxed">
            <span className="font-semibold text-gray-700">痛点：</span>{course.pain}
          </p>
        </div>

        {/* Highlights */}
        <ul className="space-y-2 mb-4 flex-1">
          {course.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: course.color }} />
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Outcome */}
        <div
          className="rounded-lg px-4 py-3 mb-4 text-sm font-semibold text-white text-center"
          style={{ backgroundColor: course.color }}
        >
          学完收获：{course.outcome}
        </div>

        {/* CTA */}
        <button
          onClick={() => document.querySelector("#contact")?.scrollIntoView({ behavior: "smooth" })}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg border-2 font-semibold text-sm transition-all duration-200 hover:text-white active:scale-95"
          style={{ borderColor: course.color, color: course.color }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = course.color;
            (e.currentTarget as HTMLButtonElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = course.color;
          }}
        >
          了解详情 <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

export default function CoursesSection() {
  const titleRef = useRef<HTMLDivElement>(null);
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true); },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="courses" className="py-20 bg-gray-50">
      <div className="container">
        {/* Section Header */}
        <div
          ref={titleRef}
          className={`scroll-reveal ${titleVisible ? "visible" : ""} text-center mb-14`}
        >
          <div className="inline-flex items-center gap-2 bg-[#E63329]/10 border border-[#E63329]/30 rounded-full px-4 py-1.5 mb-4">
            <span className="w-2 h-2 bg-[#E63329] rounded-full" />
            <span className="text-[#E63329] text-sm font-semibold">四大人群定制课程</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-gray-900 mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
            人人都有专属成长路径
          </h2>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            无论你是零基础小白、职场精英、企业管理者还是青少年，AI 黄埔学院都有为你量身定制的全周期成长方案。
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, i) => (
            <CourseCard key={course.title} course={course} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
