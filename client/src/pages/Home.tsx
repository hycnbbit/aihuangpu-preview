/*
 * Home — AI 黄埔学院主页
 * 风格：现代科技感 × 中国红精神
 * 页面结构：Navbar → Hero → Courses → Advantages → Mission → About → Contact → Footer
 */
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import CoursesSection from "@/components/CoursesSection";
import AdvantagesSection from "@/components/AdvantagesSection";
import MissionSection from "@/components/MissionSection";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import ProcessSection from "@/components/ProcessSection";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <CoursesSection />
      <AdvantagesSection />
      <MissionSection />
      <AboutSection />
      <ProcessSection />
      <ContactSection />
      <Footer />
      <FloatingCTA />
    </div>
  );
}
