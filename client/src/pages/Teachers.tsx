/*
 * Teachers — AI 黄埔学院名师展示页面
 * 展示导师头像、姓名、背景经历、主教课程
 */
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import { Link } from "wouter";
import { ChevronRight, Award, BookOpen, Briefcase } from "lucide-react";

interface Teacher {
  id: number;
  name: string;
  title: string;
  avatar: string;
  avatarPosition?: string;
  tags: string[];
  experience: string[];
  teaching: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: "王子健",
    title: "AI 行业研究员 · OPC 践行者",
    avatar: "/manus-storage/teacher-wangzijian_6c072819.webp",
    tags: ["AI研究", "G20青联", "福布斯专栏"],
    experience: [
      "AI 行业研究员，深度研究 AI 产业趋势与应用落地",
      "90 后 OPC（One Person Company）践行者，探索 AI 赋能个人创业",
      "G20 青年联合会委员，福布斯中国专栏作家",
    ],
    teaching: "聚焦 AI 行业前沿研究与 OPC（一人公司）实战方法论，帮助学员用 AI 工具实现个人效能最大化，探索 AI 时代的个人商业模式与变现路径。",
  },
  {
    id: 2,
    name: "James Zhao",
    title: "Sunday Venture Studio 合伙人 · 独立 AI 研究员",
    avatar: "/manus-storage/teacher-james_449407ef.jpg",
    avatarPosition: "center 30%",
    tags: ["硅谷视角", "AI Agent", "早期投资"],
    experience: [
      "Sunday Venture Studio 合伙人，深耕硅谷科技创业生态",
      "独立 AI 研究员，专注 long horizon auto agent 赛道前沿研究",
      "opc.ren 早期投资人，推动 AI 从工具走向操作系统",
    ],
    teaching: "以硅谷视角解读 AI Agent 最新进展，聚焦 long horizon auto agent 技术趋势与商业化路径，帮助学员理解 AI 从工具到操作系统的范式转变，把握下一波 AI 创业机遇。",
  },
  {
    id: 3,
    name: "王海平",
    title: "百度高级工程师 · AI 技术顾问",
    avatar: "/manus-storage/teacher-wanghaiping_a6d45319.webp",
    tags: ["百度", "好未来", "AI工程"],
    experience: [
      "百度高级工程师，深耕 AI 技术研发与工程落地",
      "好未来前技术委员会主席，AI 团队负责人",
      "企业技术咨询与顾问，AI 方向一人公司投资与实践者",
    ],
    teaching: "专注 AI 技术工程化落地，从大模型应用开发到企业 AI 系统架构，结合百度与好未来的一线实战经验，帮助学员掌握 AI 技术在真实业务场景中的落地方法。",
  },
  {
    id: 4,
    name: "Dafu Gao",
    title: "OnePiece Labs 孵化器合伙人 · 硅谷连续创业者",
    avatar: "/manus-storage/teacher-dafu_fb4b9275.jpg",
    tags: ["硅谷创业", "孵化器", "500+初创"],
    experience: [
      "曾任英途北美 CIO、车库咖啡北美分部负责人、风子科技联合创始人",
      "曾任 OnePiece Work 孵化器合伙人、7EDU 合伙人",
      "现任 OnePiece Labs 孵化器合伙人，曾服务、孵化、投资超过 500 家初创公司",
    ],
    teaching: "以硅谷连续创业者与顶级孵化器合伙人的视角，分享 AI 时代的创业方法论、产品从 0 到 1 的路径，以及如何借助 AI 工具快速验证商业模式，助力学员在 AI 浪潮中找到自己的创业机会。",
  },
  {
    id: 5,
    name: "融合",
    title: "连续创业者 · AI 培训讲师",
    avatar: "/manus-storage/teacher-ronghe_d7de17bf.jpg",
    tags: ["AI产品", "心愿卡", "Onex社区"],
    experience: [
      "连续创业者，互联网产品经理，拥有丰富的产品从 0 到 1 经验",
      "AI 教育类产品「心愿卡」创始人，将 AI 与情感化产品设计深度融合",
      "Onex AI 社区资深开发者，活跃于 AI 应用开发前沿社区",
    ],
    teaching: "专注 AI 产品设计与实战开发，从需求洞察到 AI 工具选型、从原型设计到产品上线，手把手带领学员用 AI 快速构建自己的产品，实现从想法到变现的完整闭环。",
  },
  {
    id: 6,
    name: "Joshua",
    title: "AI 原生开发者 · Imgou.com 创始人",
    avatar: "/manus-storage/teacher-joshua_996841cc.jpg",
    tags: ["AI开发", "Multi-Agent", "外贸AI"],
    experience: [
      "AI 原生开发者，擅长用 AI 多 Agent 协作模式构建复杂业务系统",
      "AI 产品 Imgou.com 创始人，专注 B 端 AI 产品开发",
      "深耕外贸行业流程优化，将 AI 技术与传统行业深度结合",
    ],
    teaching: "专注 AI 多 Agent 协作开发实战，涵盖 B 端产品 AI 化改造、外贸行业 AI 流程优化、Imgou.com 产品实践案例，帮助学员掌握用 AI Agent 解决真实业务问题的完整方法论。",
  },
  {
    id: 7,
    name: "蔡清华",
    title: "资深软件工程师 · AI 编程工具深度用户",
    avatar: "/manus-storage/teacher-caiqinghua-new_2c302de7.png",
    avatarPosition: "center center",
    tags: ["AI编程", "芯片设计", "20年经验"],
    experience: [
      "20 年软件/通讯系统研发经验，技术功底深厚",
      "从事芯片设计相关工作，具备硬件与软件跨领域视角",
      "深度使用 ChatGPT、Cursor、Claude Code 等 AI 编程工具",
    ],
    teaching: "专注 AI 辅助编程实战，从 Cursor、Claude Code 到 ChatGPT 代码生成，结合 20 年软件研发经验，帮助工程师和非技术人员快速掌握 AI 编程工具，大幅提升开发效率。",
  },
  {
    id: 8,
    name: "冯红兵",
    title: "联拓数科 CEO · 产业互联网专家",
    avatar: "/manus-storage/teacher-fenghongbing_8fea29aa.jpg",
    tags: ["产业互联网", "线下数字化", "AI应用"],
    experience: [
      "联拓数科 CEO，资深产业互联网产品经理",
      "12 年线下商业数字化实践经验，服务多个传统行业数字化转型",
      "深度 AI 产品使用者，将 AI 工具系统性融入企业运营管理",
    ],
    teaching: "专注线下商业 AI 数字化转型，结合 12 年产业互联网实战经验，帮助传统企业和实体商业找到 AI 落地的切入点，从流程优化到智能决策，实现低成本、高效率的 AI 转型。",
  },
];

export default function Teachers() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Navbar />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1117] via-[#1a0a0a] to-[#0D1117]" />
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, #E63329 0%, transparent 50%), radial-gradient(circle at 80% 20%, #E63329 0%, transparent 40%)",
          }}
        />
        <div className="container relative z-10 text-center">
          {/* Breadcrumb */}
          <div className="flex items-center justify-center gap-2 text-white/40 text-sm mb-6">
            <Link href="/" className="hover:text-white/70 transition-colors">
              首页
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/70">名师展示</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#E63329]/40 bg-[#E63329]/10 text-[#E63329] text-sm font-medium mb-5">
            <Award className="w-4 h-4" />
            硬核师资 · 实战为王
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white mb-4"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            AI 黄埔名师团队
          </h1>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            每一位导师均来自头部科技企业、顶尖创业生态或硅谷前沿圈层，只教真东西、只讲真案例、只带真项目
          </p>
          {/* Stats */}
          <div className="flex items-center justify-center gap-10 mt-10">
            {[
              { value: "8+", label: "实战导师" },
              { value: "10年+", label: "平均从业经验" },
              { value: "500+", label: "服务企业/项目" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl font-bold text-[#E63329]">
                  {stat.value}
                </div>
                <div className="text-white/50 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teachers Grid */}
      <section className="py-16">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teachers.map((teacher) => (
              <div
                key={teacher.id}
                className="group bg-[#161B22] border border-white/8 rounded-2xl overflow-hidden hover:border-[#E63329]/40 hover:shadow-xl hover:shadow-[#E63329]/5 transition-all duration-300"
              >
                {/* Avatar */}
                <div className="relative h-60 overflow-hidden bg-[#0D1117]">
                  <img
                    src={teacher.avatar}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    style={{ objectPosition: teacher.avatarPosition ?? "center top" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent" />
                  {/* Tags */}
                  <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
                    {teacher.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 bg-[#E63329]/90 text-white text-xs font-medium rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Name & Title */}
                  <div className="mb-4">
                    <h3
                      className="text-lg font-bold text-white mb-1"
                      style={{ fontFamily: "'Noto Serif SC', serif" }}
                    >
                      {teacher.name}
                    </h3>
                    <p className="text-[#E63329] text-xs font-medium leading-relaxed">
                      {teacher.title}
                    </p>
                  </div>

                  {/* Experience */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
                      <Briefcase className="w-3 h-3" />
                      背景经历
                    </div>
                    <ul className="space-y-1.5">
                      {teacher.experience.map((exp, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-2 text-white/65 text-xs leading-relaxed"
                        >
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#E63329] flex-shrink-0" />
                          {exp}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Teaching */}
                  <div>
                    <div className="flex items-center gap-1.5 text-white/50 text-xs font-medium mb-2 uppercase tracking-wider">
                      <BookOpen className="w-3 h-3" />
                      主教内容
                    </div>
                    <p className="text-white/65 text-xs leading-relaxed">
                      {teacher.teaching}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#161B22]">
        <div className="container text-center">
          <h2
            className="text-2xl md:text-3xl font-bold text-white mb-4"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            想跟哪位导师学习？
          </h2>
          <p className="text-white/60 mb-8 max-w-xl mx-auto">
            立即咨询，获取专属课程方案与导师匹配建议，找到最适合你的成长路径
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#E63329] hover:bg-[#c42a21] active:scale-95 text-white font-semibold rounded-lg transition-all duration-200"
          >
            立即咨询，匹配专属导师
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
      <FloatingCTA />
    </div>
  );
}
