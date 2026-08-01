"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { ContactFormData } from "@/lib/types";

function validateForm(data: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  if (!data.name.trim()) errors.name = "Name is required";
  if (!data.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Please enter a valid email";
  }
  if (!data.subject.trim()) errors.subject = "Subject is required";
  if (!data.message.trim()) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }
  return errors;
}

export default function ArchitectContact() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("sending");

    // Fire the API call in the background and immediately redirect to Calendly
    // so the user never waits — lead data is sent async.
    try {
      fetch("/api/consulting/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          project_details: formData.message,
        }),
      }).catch(() => {
        // Silent fail — user is already on Calendly
      });
    } catch { /* ignore */ }

    // Immediately redirect to Calendly with pre-filled lead data
    const calendlyUrl = new URL("https://calendly.com/derrickodiwuor/30min");
    calendlyUrl.searchParams.set("name", formData.name);
    calendlyUrl.searchParams.set("email", formData.email);
    window.location.replace(calendlyUrl.toString());
  };

  // Minimalist underline field — 1px grey bottom border, 2px accent on focus.
  const fieldClass = (hasError: boolean) =>
    `w-full bg-transparent border-0 border-b py-4 px-0 focus:outline-none transition-all duration-300 font-sans placeholder:text-grey-500/60 ${
      hasError
        ? "border-red-400 dark:border-red-500"
        : "border-grey-300 dark:border-warm-700 focus:border-accent dark:focus:border-cream"
    } text-warm-900 dark:text-cream`;

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 bg-white dark:bg-warm-900"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8 text-center flex flex-col items-center gap-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center gap-4"
        >
          <p className="text-xs uppercase tracking-[0.22em] font-semibold text-grey-500 dark:text-grey-500">
            Let's Talk
          </p>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-warm-900 dark:text-cream max-w-2xl leading-tight">
            Ready to automate your operational architecture?
          </h2>
          <p className="text-lg text-grey-700 dark:text-grey-300 max-w-xl">
            Let's discuss how we can streamline your workflows and leverage
            AI to give your team more time for high-impact work.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          noValidate
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full max-w-lg flex flex-col gap-6 mt-4 text-left"
        >
          <div>
            <label htmlFor="a-name" className="sr-only">
              Your Name
            </label>
            <input
              id="a-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={fieldClass(!!errors.name)}
              placeholder="Your Name"
            />
            {errors.name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.name}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="a-email" className="sr-only">
              Your Work Email
            </label>
            <input
              id="a-email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={fieldClass(!!errors.email)}
              placeholder="Your Work Email"
            />
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.email}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="a-subject" className="sr-only">
              Subject
            </label>
            <input
              id="a-subject"
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className={fieldClass(!!errors.subject)}
              placeholder="Subject"
            />
            {errors.subject && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.subject}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="a-message" className="sr-only">
              Message
            </label>
            <textarea
              id="a-message"
              name="message"
              rows={3}
              value={formData.message}
              onChange={handleChange}
              className={`${fieldClass(!!errors.message)} resize-none`}
              placeholder="Tell me about your bottleneck"
            />
            {errors.message && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.message}
              </p>
            )}
          </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="self-center mt-2 rounded-[100px] border-[1.5px] bg-[#1C1B18] px-10 py-3 text-sm font-semibold text-white transition-all duration-[600ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] active:scale-[0.95] disabled:opacity-60 disabled:cursor-not-allowed"
      >
            {status === "sending" ? (
              <>
                <span className="animate-spin inline-block w-4 h-4 border-2 border-cream/30 border-t-cream dark:border-accent/30 dark:border-t-accent rounded-full" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Submit Inquiry
              </>
            )}
          </button>

          {/* Status */}
          {status === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 text-sm text-center"
            >
              <CheckCircle className="w-4 h-4" />
              Message sent — I'll get back to you shortly.
            </motion.div>
          )}
          {status === "error" && (
            <motion.div
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-red-500 dark:text-red-400 text-sm text-center"
            >
              <AlertCircle className="w-4 h-4" />
              Something went wrong — email me at derrickodiwuor@gmail.com.
            </motion.div>
          )}
        </motion.form>
      </div>
    </section>
  );
}
