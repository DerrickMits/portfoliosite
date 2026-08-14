import nodemailer from "nodemailer";

let _transporter: nodemailer.Transporter | null = null;

function getTransporter() {
  if (!_transporter) {
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    if (!smtpUser || !smtpPass) return null;
    _transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: smtpUser, pass: smtpPass },
    });
  }
  return _transporter;
}

interface ClientFormData {
  companyName: string;
  projectScope: string;
  crmSetup: string;
  primaryBottleneck: string;
  currentTools: string[];
  manualTaskDescription?: string;
  fullName: string;
  workEmail: string;
  hasAdminCredentialsReady: boolean;
}

/**
 * Generate a personalized confirmation email for the client using Gemini
 * based on their specific form responses
 */
export async function generateClientConfirmationEmail(data: ClientFormData): Promise<{ subject: string; html: string; text: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://portfoliosite-pearl-one.vercel.app";
  
  const prompt = `You are Derrick Odiwuor, an Operations & AI Automation Architect. Write a warm, personalized confirmation email for a new consulting applicant.

APPLICANT DETAILS:
- Name: ${data.fullName}
- Company: ${data.companyName}
- Project Scope: ${data.projectScope}
- Current CRM: ${data.crmSetup}
- Primary Bottleneck: ${data.primaryBottleneck}
- Current Tools: ${data.currentTools.join(", ") || "None specified"}
- Manual Task to Automate: ${data.manualTaskDescription || "Not specified"}
- Admin Credentials Ready: ${data.hasAdminCredentialsReady ? "Yes" : "No"}

REQUIREMENTS:
- Warm, professional, personal tone — like a real person writing, not a template
- Reference their specific project/bottleneck to show you actually read their application
- Mention their CRM and tools context briefly
- Confirm their Setup Sprint will be tailored to their situation
- Include next steps: they'll be redirected to Calendly to book a 30-min slot
- Sign off as "Derrick Odiwuor"
- Max 200 words
- No generic phrases like "I hope this email finds you well" or "Thank you for your interest"
- Return ONLY a JSON object with: subject, html, text`;

  let subject = `Welcome, ${data.fullName} — your Setup Sprint is being prepared`;
  let html = `<p>We've received your application for <strong>${data.companyName}</strong>. We'll reach out within 24 hours to schedule your Setup Sprint.</p>`;
  let text = `We've received your application for ${data.companyName}. We'll reach out within 24 hours to schedule your Setup Sprint.`;

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.7 },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const content = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (content) {
          try {
            const parsed = JSON.parse(content);
            subject = parsed.subject || subject;
            html = parsed.html || html;
            text = parsed.text || text;
          } catch {
            // If not valid JSON, use the raw content as text
            text = content;
            html = content.replace(/\n/g, "<br>");
          }
        }
      }
    } catch (err) {
      console.error("Gemini client email generation failed:", err);
    }
  }

  // Removed onboarding portal link as requested

  return { subject, html, text };
}

/**
 * Generate a personalized admin notification email using Gemini
 */
export async function generateAdminNotificationEmail(data: ClientFormData, clientId: string): Promise<{ subject: string; html: string; text: string }> {
  const geminiKey = process.env.GEMINI_API_KEY;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "https://portfoliosite-pearl-one.vercel.app";
  
  const prompt = `You are Derrick Odiwuor's AI assistant. Write a concise, actionable admin notification for a new consulting application.

APPLICANT DETAILS:
- Name: ${data.fullName}
- Email: ${data.workEmail}
- Company: ${data.companyName}
- Project Scope: ${data.projectScope}
- Current CRM: ${data.crmSetup}
- Primary Bottleneck: ${data.primaryBottleneck}
- Current Tools: ${data.currentTools.join(", ") || "None specified"}
- Manual Task to Automate: ${data.manualTaskDescription || "Not specified"}
- Admin Credentials Ready: ${data.hasAdminCredentialsReady ? "Yes" : "No"}
- Client ID: ${clientId}

REQUIREMENTS:
- Professional, scannable format
- Highlight the key context (CRM, bottleneck, tools) for quick prep
- Flag if admin credentials are ready (means faster start)
- Max 250 words
- Return ONLY a JSON object with: subject, html, text`;

  let subject = `��🔔 New Consulting Application — ${data.companyName}`;
  let html = `
    <h3>New Consulting Application</h3>
    <p><strong>Client ID:</strong> ${clientId}</p>
    <p><strong>Company:</strong> ${data.companyName}</p>
    <p><strong>Contact:</strong> ${data.fullName} (${data.workEmail})</p>
    <p><strong>Project Scope:</strong> ${data.projectScope}</p>
    <p><strong>Current CRM:</strong> ${data.crmSetup}</p>
    <p><strong>Primary Bottleneck:</strong> ${data.primaryBottleneck}</p>
    <p><strong>Current Tools:</strong> ${data.currentTools.length > 0 ? data.currentTools.join(', ') : 'None specified'}</p>
    <p><strong>Manual Task to Automate:</strong> ${data.manualTaskDescription || 'Not specified'}</p>
    <p><strong>Admin Credentials Ready:</strong> ${data.hasAdminCredentialsReady ? 'Yes' : 'No'}</p>
  `;
  let text = `
New Consulting Application

Client ID: ${clientId}
Company: ${data.companyName}
Contact: ${data.fullName} (${data.workEmail})
Project Scope: ${data.projectScope}
Current CRM: ${data.crmSetup}
Primary Bottleneck: ${data.primaryBottleneck}
Current Tools: ${data.currentTools.length > 0 ? data.currentTools.join(', ') : 'None specified'}
Manual Task to Automate: ${data.manualTaskDescription || 'Not specified'}
Admin Credentials Ready: ${data.hasAdminCredentialsReady ? 'Yes' : 'No'}
  `.trim();

  if (geminiKey) {
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(geminiKey)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 600, temperature: 0.5 },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const content = json?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        if (content) {
          try {
            const parsed = JSON.parse(content);
            subject = parsed.subject || subject;
            html = parsed.html || html;
            text = parsed.text || text;
          } catch {
            text = content;
            html = content.replace(/\n/g, "<br>");
          }
        }
      }
    } catch (err) {
      console.error("Gemini admin email generation failed:", err);
    }
  }

  // Removed onboarding portal link as requested

  return { subject, html, text };
}

export async function sendClientConfirmationEmail(clientId: string, clientName: string, email: string, formData?: ClientFormData) {
  const transporter = getTransporter();
  if (!transporter) return;

  let subject = `Welcome, ${clientName} — your Setup Sprint is being prepared`;
  let html = `<p>We've received your application. We'll reach out within 24 hours.</p>`;
  let text = `We've received your application. We'll reach out within 24 hours.`;

  if (formData) {
    const generated = await generateClientConfirmationEmail(formData);
    subject = generated.subject;
    html = generated.html;
    text = generated.text;
  }

  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
    text,
  });
}

export async function sendAdminNotificationEmail(payload: Record<string, unknown>, formData?: ClientFormData, clientId?: string) {
  const transporter = getTransporter();
  if (!transporter) return;

  let subject = `🔔 New Consulting Application — ${payload.companyName}`;
  let html = `<h3>New Consulting Application</h3><pre>${JSON.stringify(payload, null, 2)}</pre>`;
  let text = `New lead submitted:\n\n${JSON.stringify(payload, null, 2)}`;

  if (formData && clientId) {
    const generated = await generateAdminNotificationEmail(formData, clientId);
    subject = generated.subject;
    html = generated.html;
    text = generated.text;
  }

  await transporter.sendMail({
    from: `"Derrick Odiwuor" <${process.env.SMTP_FROM ?? process.env.SMTP_USER}>`,
    to: process.env.RESEND_ADMIN_EMAIL ?? process.env.SMTP_FROM ?? "derrickodiwuor@gmail.com",
    subject,
    html,
    text,
  });
}
