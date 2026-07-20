"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, ExternalLink, Send, CheckCircle, AlertCircle } from "lucide-react";
import { ContactFormData } from "@/lib/types";

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "derrickodiwuor@gmail.com",
    href: "mailto:derrickodiwuor@gmail.com",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+254 713 965 539",
    href: "tel:+254713965539",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Nairobi, Kenya",
    href: null,
  },
];

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

export default function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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

    // POST to the Next.js API route which sends email via Gmail SMTP
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        // Server-side field validation errors
        if (data.errors) {
          setErrors(data.errors as Record<string, string>);
          setStatus("idle");
          return;
        }
        throw new Error(data.error || "Request failed");
      }

      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section
      id="contact"
      className="relative py-20 md:py-28 bg-white dark:bg-warm-900"
    >
      <div className="z-10 relative max-w-6xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-3">
            Get In Touch
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Let&apos;s Connect
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-5 gap-12 md:gap-16">
          {/* Left: Contact Details */}
          <motion.div
            className="md:col-span-2 space-y-8"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h3 className="text-xl font-semibold text-warm-900 dark:text-warm-100 font-display">
              Contact Information
            </h3>
            <p className="text-warm-600 dark:text-warm-300 leading-relaxed">
              I&apos;m currently open to global remote and on-site opportunities.
              Feel free to reach out, I&apos;ll respond within 24 hours.
            </p>

            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-warm-100 dark:bg-warm-800 flex items-center justify-center">
                    <item.icon className="w-5 h-5 text-warm-700 dark:text-warm-300" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-warm-500 dark:text-warm-400">
                      {item.label}
                    </p>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="text-warm-900 dark:text-warm-100 hover:text-warm-600 dark:hover:text-warm-300 transition-colors font-medium"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-warm-900 dark:text-warm-100 font-medium">
                        {item.value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://linkedin.com/in/derrickodiwuor"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
                aria-label="LinkedIn"
              >
                <ExternalLink className="w-5 h-5 text-warm-700 dark:text-warm-300" />
              </a>
              <a
                href="mailto:derrickodiwuor@gmail.com"
                className="w-10 h-10 rounded-lg bg-warm-100 dark:bg-warm-800 flex items-center justify-center hover:bg-warm-200 dark:hover:bg-warm-700 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5 text-warm-700 dark:text-warm-300" />
              </a>
            </div>
          </motion.div>

          {/* Right: Contact Form */}
          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5"
                  >
                    Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      errors.name
                        ? "border-red-400 dark:border-red-500"
                        : "border-warm-200 dark:border-warm-700"
                    } bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 placeholder-warm-400 dark:placeholder-warm-600 focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-600 transition-all`}
                    placeholder="Your full name"
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5"
                  >
                    Email *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.email
                        ? "border-red-400 dark:border-red-500"
                        : "border-warm-200 dark:border-warm-700"
                    } bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 placeholder-warm-400 dark:placeholder-warm-600 focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition-all`}
                    placeholder="your@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.subject
                      ? "border-red-400 dark:border-red-500"
                      : "border-warm-200 dark:border-warm-700"
                  } bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 placeholder-warm-400 dark:placeholder-warm-600 focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition-all`}
                  placeholder="What's this about?"
                />
                {errors.subject && (
                  <p className="text-red-500 text-xs mt-1">{errors.subject}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-warm-700 dark:text-warm-300 mb-1.5"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.message
                      ? "border-red-400 dark:border-red-500"
                      : "border-warm-200 dark:border-warm-700"
                  } bg-white dark:bg-warm-800 text-warm-900 dark:text-warm-100 placeholder-warm-400 dark:placeholder-warm-600 focus:outline-none focus:ring-2 focus:ring-warm-400 dark:focus:ring-warm-500 transition-all resize-none`}
                  placeholder="Tell me about your opportunity..."
                />
                {errors.message && (
                  <p className="text-red-500 text-xs mt-1">{errors.message}</p>
                )}
              </div>

              <button
                type="submit"
                disabled={status === "sending"}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-warm-900 dark:bg-warm-100 text-white dark:text-warm-900 font-medium hover:bg-warm-800 dark:hover:bg-warm-200 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "sending" ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              {/* Status Messages */}
              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm"
                >
                  <CheckCircle className="w-4 h-4" />
                  Message sent successfully! I&apos;ll get back to you shortly.
                </motion.div>
              )}
              {status === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-red-500 text-sm"
                >
                  <AlertCircle className="w-4 h-4" />
                  Something went wrong. Please email me directly at
                  derrickodiwuor@gmail.com.
                </motion.div>
              )}
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}