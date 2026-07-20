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