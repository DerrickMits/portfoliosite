import { getAllPosts } from "@/lib/posts";
import HeroSection from "@/components/HeroSection";
import CertificationsSection from "@/components/CertificationsSection";
import ExperienceSection from "@/components/ExperienceSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import BlogSection from "@/components/BlogSection";
import BeyondWorkSection from "@/components/BeyondWorkSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import { ROICalculator } from "@/components/ROICalculator";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <HeroSection />
      <ROICalculator />
      <CertificationsSection />
      <ExperienceSection />
      <RecommendationsSection />
      <ProjectsSection />
      <SkillsSection />
      <BlogSection posts={posts} />
      <BeyondWorkSection />
      <ContactSection />
      <Footer />
    </>
  );
}