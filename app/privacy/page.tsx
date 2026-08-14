import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Derrick Odiwuor",
  description: "Privacy Policy for Derrick Odiwuor's portfolio, consulting services, and resource hub. Covers data collection, usage, and protection in compliance with Kenya Data Protection Act.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] text-zinc-900 antialiased">
      {/* Hero Section */}
      <section className="border-b border-[#E4E2DC] bg-[#F4F2ED]">
        <div className="max-w-4xl mx-auto px-6 py-16 md:py-24">
          <nav className="mb-8 text-sm text-zinc-600" aria-label="Breadcrumb">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-zinc-900 transition-colors">
                  Home
                </Link>
              </li>
              <li className="text-zinc-400" aria-hidden="true">/</li>
              <li aria-current="page">
                <span className="text-zinc-900 font-medium">Privacy Policy</span>
              </li>
            </ol>
          </nav>
          <header>
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Privacy Policy
            </h1>
            <p className="text-zinc-600 text-lg">
              Last Updated: August 2026
            </p>
          </header>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-6">
          <article className="prose prose-zinc max-w-none prose-img:rounded-xl prose-headings:text-zinc-900 prose-body:text-zinc-600 prose-links:text-zinc-900 prose-bold:text-zinc-900 prose-code:text-zinc-900 prose-pre:bg-[#F4F2ED] prose-pre:code:text-zinc-900 prose-hr:border-[#E4E2DC] prose-quote:border-l-[#E4E2DC] prose-ul:marker:text-[#E4E2DC]">
            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Overview & Commitment</h2>
              <p className="text-zinc-600 leading-relaxed">
                We respect your privacy and are committed to protecting the personal information you share with us. This Privacy Policy outlines how data is collected, used, and safeguarded across our portfolio, article hub, resource directories, and consulting intake channels in accordance with applicable data protection regulations (including the Kenya Data Protection Act and international best practices).
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Information We Collect</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                We collect personal information that you voluntarily provide to us when you:
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed mb-4">
                <li>Complete a project discovery or intake form on our consulting portal (<code className="bg-[#E4E2DC] px-1.5 py-0.5 rounded text-sm font-mono">/architect</code>).</li>
                <li>Subscribe to resources, articles, or download templates.</li>
                <li>Reach out directly via email or communication channels.</li>
              </ul>
              <p className="text-zinc-600 leading-relaxed">
                This information may include: Full name, business email address, company name, project specifications, CRM/tech stack details, and budget parameters.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Technical & Usage Data</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                When browsing our site, certain non-personally identifiable information may be collected automatically via hosting and analytics providers (such as Vercel Analytics), including:
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed">
                <li>Browser type and operating system.</li>
                <li>Referring URLs and page navigation paths.</li>
                <li>General geographic region and device type.</li>
              </ul>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. How We Use Your Information</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                We use your information strictly to:
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed mb-4">
                <li>Evaluate client requirements and deliver custom technical/consulting proposals.</li>
                <li>Respond to inquiries and communicate regarding project roadmaps.</li>
                <li>Maintain, optimize, and improve website performance and user experience.</li>
                <li>Prevent fraudulent or unauthorized system usage.</li>
              </ul>
              <p className="text-zinc-600 leading-relaxed font-medium">
                We do NOT sell, rent, or trade your personal data to third parties.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Data Processors & Third-Party Services</h2>
              <p className="text-zinc-600 leading-relaxed">
                We may utilize trusted third-party cloud infrastructure and integration providers to handle form workflows and hosting (e.g., Vercel, Supabase, Zapier, Google Workspace). Data shared with these processors is strictly for functional processing under secure protocols.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Data Security & Retention</h2>
              <p className="text-zinc-600 leading-relaxed">
                We implement industry-standard technical and organizational security measures to protect your data. Information collected through inquiry forms is retained only as long as necessary to fulfill consulting evaluation, deliver services, or comply with legal obligations.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Your Data Protection Rights</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                Depending on your jurisdiction, you have the right to:
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed">
                <li>Request access to the personal data we hold about you.</li>
                <li>Request correction of inaccurate or incomplete data.</li>
                <li>Request erasure of your personal data from our active databases.</li>
                <li>Withdraw consent at any time for direct communications.</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">8. Contact & Data Controller</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                To exercise your privacy rights or submit questions regarding data handling practices, please submit an inquiry through the contact section on the site.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-900 hover:text-black border-b border-transparent hover:border-zinc-400 transition-colors font-medium"
              >
                Return to Homepage →
              </Link>
            </section>
          </article>
        </div>
      </section>
    </main>
  );
}