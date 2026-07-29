import { getAllPosts } from "@/lib/posts";
import HeroSection from "@/components/HeroSection";
import CertificationsSection from "@/components/CertificationsSection";
import ExperienceSection from "@/components/ExperienceSection";
import RecommendationsSection from "@/components/RecommendationsSection";
import ProjectsSection from "@/components/ProjectsSection";
import SkillsSection from "@/components/SkillsSection";
import BlogSection from "@/components/BlogSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <HeroSection />
      <CertificationsSection />
      <ExperienceSection />
      <RecommendationsSection />
      <ProjectsSection />
      <SkillsSection />
      <BlogSection posts={posts} />
      <ContactSection />
      <Footer />
    </>
  );
}