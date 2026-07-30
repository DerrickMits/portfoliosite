"use client";

import { motion } from "framer-motion";
import SocialCards, { CardItem } from "@/components/ui/card-fan-carousel";

const sectionEyebrow = "Off the Clock";
const sectionTitle = "Beyond Work";
const sectionIntro =
  "A few moments outside the dashboard. Paintballing with the crew, team building offsites, and conversations that started as networking and became something more.";

const beyondWorkCards: CardItem[] = [
  {
    imgUrl: "/beyond-work/Paintballing.jpeg",
    alt: "Paintballing with the team",
    caption: "Paintballing",
  },
  {
    imgUrl: "/beyond-work/Team%20building.jpeg",
    alt: "Team building offsite",
    caption: "Team Building",
  },
  {
    imgUrl: "/beyond-work/Networking.jpeg",
    alt: "Networking event",
    caption: "Networking",
  },
];

export default function BeyondWorkSection() {
  return (
    <section
      id="beyond-work"
      className="relative py-20 md:py-28 bg-cream dark:bg-deep"
    >
      <div className="z-10 max-w-6xl mx-auto px-6 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <p className="text-sm uppercase tracking-[0.2em] font-semibold text-warm-500 dark:text-warm-400 mb-4">
            {sectionEyebrow}
          </p>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-warm-900 dark:text-warm-100">
            {sectionTitle}
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-base md:text-lg leading-relaxed text-warm-600 dark:text-warm-400">
            {sectionIntro}
          </p>
        </motion.div>

        <SocialCards cards={beyondWorkCards} />
      </div>
    </section>
  );
}
