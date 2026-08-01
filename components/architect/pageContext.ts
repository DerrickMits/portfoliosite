/**
 * Builds a lightweight content digest of the current page so the AI
 * assistant always has fresh context about what Derrick offers.
 *
 * This runs client-side and is sent as a system preamble with every
 * chat request — no backend changes needed.
 */

export type PageContext = {
  route: string;
  title: string;
  sections: { id: string; heading: string; summary: string }[];
};

const HOME_CONTEXT: PageContext = {
  route: "/",
  title: "Derrick Odiwuor — Executive Operations Coordinator",
  sections: [
    {
      id: "about",
      heading: "About",
      summary:
        "Derrick Odiwuor, high-impact operations professional and MBA candidate. Specializes in project management, CRM optimization (HubSpot, GoHighLevel, Salesforce), and AI automation workflows. Based in Nairobi, Kenya.",
    },
    {
      id: "certifications",
      heading: "Certifications",
      summary:
        "HubSpot Inbound, Content, Email, ABM Marketing certifications; Salesforce Admin & Foundations; Google Agile Project Management.",
    },
    {
      id: "experience",
      heading: "Work Experience",
      summary:
        "Executive Partner at Athena. Past roles in operations coordination, project management, and sales operations across Nairobi-based organizations.",
    },
    {
      id: "projects",
      heading: "Featured Projects",
      summary:
        "Executive Calendar Automation, GoHighLevel Multi-Stage Sales Engine, Automated Collections & Debt Reduction, Campaign ROI Dashboards, No-Show Recovery Pipeline.",
    },
    {
      id: "skills",
      heading: "Skills & Expertise",
      summary:
        "Project Management, CRM Architecture & Optimization, Analytics & Data Visualization, Sales Operations.",
    },
    {
      id: "blog",
      heading: "Blog",
      summary:
        "Long-form articles on AI and process automation, published on The Ledger.",
    },
  ],
};

const ARCHITECT_CONTEXT: PageContext = {
  route: "/architect",
  title: "Derrick Odiwuor — Operations & AI Automation Architect",
  sections: [
    {
      id: "hero",
      heading: "Overview",
      summary:
        "Derrick drives organizational efficiency through PM precision, CRM architecture, and AI workflows. Key outcomes: +35% executive focus time, 20% receivables reduction, 95% on-time delivery.",
    },
    {
      id: "services",
      heading: "Core Pillars",
      summary:
        "Three disciplines: (1) Project Management — end-to-end execution, Agile/Scrum, Asana/Jira mastery. (2) CRM Architecture — sales pipeline design, HubSpot & GoHighLevel integrations, Salesforce. (3) AI Automation — n8n & Zapier engines, multi-agent LLM pipelines, lead capture to CRM automation.",
    },
    {
      id: "case-studies",
      heading: "Case Study",
      summary:
        "Scaling lead response and routing with zero manual friction. Engineered a 4-stage GoHighLevel engine with custom workflow logic, conditional routing, and business-hour constraints. Result: 0% manual pipeline handoffs across all sales stages.",
    },
    {
      id: "stack",
      heading: "Tech Stack",
      summary:
        "GoHighLevel, HubSpot, Asana, n8n, Vercel, OpenAI, Zapier, Python.",
    },
    {
      id: "contact",
      heading: "Contact",
      summary:
        "Contact form to discuss automation needs. Also offers Calendly booking for 30-min consultations.",
    },
  ],
};

export function getPageContext(route?: string): PageContext {
  const path = route ?? (typeof window !== "undefined" ? window.location.pathname : "/");
  if (path.startsWith("/architect")) return ARCHITECT_CONTEXT;
  return HOME_CONTEXT;
}

/**
 * Formats the page context as a system-prompt preamble
 * to inject into the AI chat payload.
 */
export function formatContextPreamble(): string {
  const ctx = getPageContext();
  const sectionDigest = ctx.sections
    .map((s) => `• ${s.heading}: ${s.summary}`)
    .join("\n");

  return `[PORTFOLIO CONTEXT — live page data]\nPage: ${ctx.title}\nRoute: ${ctx.route}\n\nSections:\n${sectionDigest}\n\nAnswer questions using only the information above about Derrick's portfolio. If asked about content not listed here, say you don't have that detail on this page and suggest checking the full portfolio.`;
}
