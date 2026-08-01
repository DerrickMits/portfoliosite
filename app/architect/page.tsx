import type { Metadata } from "next";
import ArchitectHero from "@/components/architect/ArchitectHero";
import ArchitectPillars from "@/components/architect/ArchitectPillars";
import ArchitectCaseStudy from "@/components/architect/ArchitectCaseStudy";
import ArchitectTicker from "@/components/architect/ArchitectTicker";
import ArchitectContact from "@/components/architect/ArchitectContact";
import ArchitectFooter from "@/components/architect/ArchitectFooter";

export const metadata: Metadata = {
  title: "Derrick Odiwuor · Operations & AI Automation Architect",
  description:
    "A premium, editorial view of Derrick Odiwuor's operations, CRM, and AI automation practice — case studies, tech stack, and contact.",
};

export default function ArchitectPage() {
  return (
    <>
      <ArchitectHero />
      <ArchitectPillars />
      <ArchitectCaseStudy />
      <ArchitectTicker />
      <ArchitectContact />
      <ArchitectFooter />
    </>
  );
}
