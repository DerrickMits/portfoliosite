export interface Experience {
  title: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface Project {
  title: string;
  description: string;
  tools: string[];
  outcome: string;
  /** Optional external link shown only as a CTA button at the bottom of the card */
  link?: string;
  /** Optional CTA button text when `link` is present */
  ctaText?: string;
}

export interface SkillCategory {
  id: string;
  label: string;
  skills: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  readTime: string;
  content: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}