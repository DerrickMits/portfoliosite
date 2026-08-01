"use client";

const tools = [
  "GOHIGHLEVEL",
  "HUBSPOT",
  "ASANA",
  "N8N",
  "VERCEL",
  "OPENAI",
  "ZAPIER",
  "PYTHON",
];

export default function ArchitectTicker() {
  // Duplicated list for a seamless -50% translateX loop.
  const loop = [...tools, ...tools];

  return (
    <section
      id="stack"
      className="relative py-10 bg-white dark:bg-warm-900 border-y border-grey-200 dark:border-warm-800 overflow-hidden"
      aria-label="Tools & tech stack"
    >
      <div className="flex whitespace-nowrap animate-ticker items-center w-max">
        {loop.map((tool, index) => (
          <span
            key={`${tool}-${index}`}
            className="mx-8 text-xl md:text-2xl font-display font-bold text-grey-300 dark:text-warm-600 select-none"
          >
            {tool}
            <span className="mx-8 text-grey-200 dark:text-warm-800" aria-hidden>
              ·
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}
