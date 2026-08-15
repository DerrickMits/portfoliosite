import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms and Conditions | Derrick Odiwuor",
  description: "Terms and Conditions for Derrick Odiwuor's portfolio, consulting services, and resource hub.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#FDFBF7] dark:bg-deep text-zinc-900 antialiased">
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
                <span className="text-zinc-900 font-medium">Terms and Conditions</span>
              </li>
            </ol>
          </nav>
          <header>
            <p className="text-sm uppercase tracking-[0.2em] font-semibold text-zinc-600 mb-3">
              Legal
            </p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">
              Terms and Conditions
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
          <article className="prose prose-zinc max-w-none dark:prose-invert prose-img:rounded-xl prose-headings:text-zinc-900 dark:prose-headings:text-warm-100 prose-body:text-zinc-600 dark:prose-body:text-warm-400 prose-links:text-zinc-900 dark:prose-links:text-amber-400 prose-bold:text-zinc-900 dark:prose-bold:text-warm-100 prose-code:text-zinc-900 dark:prose-code:text-warm-100 prose-pre:bg-[#F4F2ED] dark:prose-pre:bg-warm-800 prose-pre:code:text-zinc-900 dark:prose-pre:code:text-warm-100 prose-hr:border-[#E4E2DC] dark:prose-hr:border-warm-700 prose-quote:border-l-[#E4E2DC] dark:prose-quote:border-l-warm-700 prose-ul:marker:text-[#E4E2DC] dark:prose-ul:marker:text-warm-500">
            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">1. Acceptance of Terms</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                By accessing or using this website, including our portfolio, article library, resource hub, and consulting services (accessible via <code className="bg-[#E4E2DC] dark:bg-warm-700 px-1.5 py-0.5 rounded text-sm font-mono">/architect</code>), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please discontinue use of the site immediately.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">2. Intellectual Property & Permitted Use</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                All original content, architectural frameworks, written articles, code snippets, system prompt templates, workflows, and visual design assets on this site are the intellectual property of the author unless otherwise indicated.
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed">
                <li>You may view, download, and reference materials for personal or internal business evaluation.</li>
                <li>You may not redistribute, resell, republish, or commercially exploit any proprietary codebases, templates, or written material without explicit prior written authorization.</li>
              </ul>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">3. Advisory & Consulting Disclaimer</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                The articles, system designs, case studies, and resource templates provided on this site are for educational and informational purposes only. While we aim for rigorous accuracy in workflow automation and technical architecture:
              </p>
              <ul className="list-disc list-inside space-y-3 text-zinc-600 leading-relaxed">
                <li>Any implementation of code, API connections, or automation logic is undertaken at your own risk.</li>
                <li>Engagement in consulting sprints or discovery calls via the <code className="bg-[#E4E2DC] dark:bg-warm-700 px-1.5 py-0.5 rounded text-sm font-mono">/architect</code> portal does not create an ongoing fiduciary liability beyond the terms outlined in a dedicated Statement of Work (SOW).</li>
              </ul>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">4. User Submissions & Form Inquiries</h2>
              <p className="text-zinc-600 leading-relaxed">
                When submitting client intake forms, project requests, or contact details, you agree to provide truthful, accurate, and current information. We reserve the right to decline inquiries or terminate engagements that misuse our contact channels.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">5. Third-Party Integrations & External Links</h2>
              <p className="text-zinc-600 leading-relaxed">
                Our ecosystem may contain links to external platforms, repositories (e.g., GitHub), or third-party automation tools (e.g., Zapier, Make, Vercel, Supabase). We hold no responsibility for the content, privacy practices, or availability of third-party platforms.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">6. Limitation of Liability</h2>
              <p className="text-zinc-600 leading-relaxed">
                Under no circumstances shall the site owner or operator be liable for any direct, indirect, incidental, consequential, or punitive damages resulting from your access to, or inability to access, this website, its resources, or any third-party integrations referenced herein.
              </p>
            </section>

            <section className="mb-12 pb-8 border-b border-[#E4E2DC]">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">7. Governing Law</h2>
              <p className="text-zinc-600 leading-relaxed">
                These terms shall be governed by and construed in accordance with the laws of Kenya, without regard to its conflict of law principles.
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-zinc-900 mb-4">8. Contact Information</h2>
              <p className="text-zinc-600 leading-relaxed mb-4">
                For questions regarding these Terms and Conditions, please contact us via the contact form on this site.
              </p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-zinc-900 dark:text-warm-100 hover:text-zinc-900 dark:hover:text-warm-100 border-b border-transparent dark:border-warm-500 hover:border-zinc-400 dark:hover:border-warm-400 transition-colors font-medium dark:text-warm-100"
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