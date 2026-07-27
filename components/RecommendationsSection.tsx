"use client";

import { motion } from "framer-motion";
import { CircularTestimonials } from "@/components/ui/circular-testimonials";

const testimonials = [
  {
    quote:
      "I've had the opportunity to see Derrick's dedication and work ethic firsthand, and one thing that stands out is his ability to deliver with excellence consistently. He approaches every challenge with a strategic mindset, communicates thoughtfully, and takes ownership from start to finish, making him someone you can always rely on. Beyond his impressive skills, Derrick is a collaborative, growth-oriented professional who raises the standard of every team and project he's part of.",
    name: "Brenda Nyakundi",
    designation: "Product and Growth, AI Courses, Moringa School",
    src: "/testimonials/Brenda%20Nyakundi.jpeg",
  },
  {
    quote:
      "Derrick Odiwuor is a sharp and proactive professional who takes initiative and consistently delivers high-quality results. As a strong team player, he collaborates effectively with others, contributes positively to the team, and builds strong working relationships. Derrick is very passionate and dedicated to his work, approaching every task with enthusiasm, commitment, and a drive for excellence. Overall, he is a proactive professional who brings skill, dedication, and a positive attitude to every challenge.",
    name: "Brian Okoth",
    designation: "Medical Representative, Harleys Pharmaceutical",
    src: "/testimonials/Brian%20Okoth.jpeg",
  },
  {
    quote:
      "Having worked closely with Derrick during my time in HR and Learning and Development at Ilara Health, I can confidently attest to his incredible dedication, reliability, and continuous drive for self-improvement. His career trajectory from a Sales Representative to a Growth Relationship Manager was well-earned, culminating in his remarkable achievement of scaling our meds financing client portfolio and generating the highest revenue in the company's history. Derrick seamlessly combines sharp commercial instincts with a data-driven approach to relationship management, making him an exceptional professional who consistently exceeds targets and elevates any team he joins.",
    name: "Teresiah Nduta",
    designation: "Executive Partner, Athena",
    src: "/testimonials/Teresiah%20Nduta.jpeg",
  },
];

export default function RecommendationsSection() {
  return (
    <section
      id="recommendations"
      className="relative py-20 md:py-28 bg-cream dark:bg-deep"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-4">
            Trusted by peers & partners
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            Peer Recommendations
          </h2>
        </motion.div>

        <div className="flex justify-center">
          <CircularTestimonials
            testimonials={testimonials}
            autoplay
            colors={{
              name: "#1C1917",
              designation: "#57534E",
              testimony: "#44403C",
              arrowBackground: "#1C1917",
              arrowForeground: "#FDFBF7",
              arrowHoverBackground: "#D6D3D1",
            }}
            fontSizes={{
              name: "22px",
              designation: "15px",
              quote: "17px",
            }}
          />
        </div>
      </div>
    </section>
  );
}
