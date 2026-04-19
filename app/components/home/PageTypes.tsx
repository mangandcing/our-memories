"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../ui/AnimatedSection";

const s = {
  fill: "none",
  stroke: "var(--gold)",
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const pageTypes = [
  {
    label: "Wedding Celebration",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <circle cx="9.5" cy="12" r="4.5" />
        <circle cx="14.5" cy="12" r="4.5" />
      </svg>
    ),
  },
  {
    label: "Birthday Wish",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M12 9.5 C13.5 8 13.5 6 12 5 C10.5 6 10.5 8 12 9.5Z" />
        <line x1="12" y1="9.5" x2="12" y2="12" />
        <rect x="9" y="12" width="6" height="7" rx="0.5" />
      </svg>
    ),
  },
  {
    label: "Wedding Invitation",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <rect x="3" y="7" width="18" height="13" rx="1" />
        <path d="M3 7.5 L12 14 L21 7.5" />
        <circle cx="12" cy="16" r="1.5" />
      </svg>
    ),
  },
  {
    label: "Anniversary",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M12 19 C12 19 3.5 14 3.5 8.5 C3.5 6 5.8 4 8.5 4 C10.2 4 11.5 5 12 6 C12.5 5 13.8 4 15.5 4 C18.2 4 20.5 6 20.5 8.5 C20.5 14 12 19 12 19Z" />
      </svg>
    ),
  },
  {
    label: "Memorial & Tribute",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M12 9 C13.5 7.5 13.5 5.5 12 4.5 C10.5 5.5 10.5 7.5 12 9Z" />
        <line x1="12" y1="9" x2="12" y2="11" />
        <rect x="10.5" y="11" width="3" height="6" rx="0.5" />
        <path d="M8 20 L9.5 17 L14.5 17 L16 20" />
        <line x1="7" y1="20" x2="17" y2="20" />
      </svg>
    ),
  },
  {
    label: "Love Letter",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M20 4 C16 5 9 12 6 20" />
        <path d="M20 4 C19 7 16 11 6 20" />
        <line x1="6" y1="20" x2="4" y2="18" />
        <line x1="6" y1="20" x2="5" y2="22" />
      </svg>
    ),
  },
  {
    label: "Gender Reveal",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M12 12 C10 10.5 7.5 9.5 7 11 C6.5 12.5 8.5 13.5 10.5 13 C11.5 12.5 12 12 12 12Z" />
        <path d="M12 12 C14 10.5 16.5 9.5 17 11 C17.5 12.5 15.5 13.5 13.5 13 C12.5 12.5 12 12 12 12Z" />
        <path d="M12 12 C10.5 14 9 16 8.5 17.5" />
        <path d="M12 12 C13.5 14 15 16 15.5 17.5" />
        <circle cx="12" cy="12" r="1" />
      </svg>
    ),
  },
  {
    label: "Birthday Invitation",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <rect x="5" y="12" width="14" height="8" rx="0.5" />
        <rect x="4" y="9" width="16" height="3" rx="0.5" />
        <line x1="12" y1="9" x2="12" y2="20" />
        <path d="M12 9 C11 7.5 8.5 7 8.5 8.5 C8.5 10 10.5 9.5 12 9Z" />
        <path d="M12 9 C13 7.5 15.5 7 15.5 8.5 C15.5 10 13.5 9.5 12 9Z" />
      </svg>
    ),
  },
  {
    label: "Ceremony Invitation",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <line x1="6" y1="20" x2="6" y2="12" />
        <path d="M6 12 C6 7 18 7 18 12" />
        <line x1="18" y1="12" x2="18" y2="20" />
        <line x1="4" y1="20" x2="20" y2="20" />
        <circle cx="12" cy="7" r="1.2" />
        <line x1="12" y1="5.8" x2="12" y2="4.5" />
      </svg>
    ),
  },
  {
    label: "Custom Page",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" {...s}>
        <path d="M12 4 L13.2 10.8 L20 12 L13.2 13.2 L12 20 L10.8 13.2 L4 12 L10.8 10.8 Z" />
        <line x1="7" y1="7" x2="8" y2="8" />
        <line x1="17" y1="7" x2="16" y2="8" />
      </svg>
    ),
  },
];

export default function PageTypes() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">Every occasion</p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">
            What will you celebrate?
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 sm:gap-4">
          {pageTypes.map((type, i) => (
            <motion.div
              key={type.label}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.5,
                delay: i * 0.06,
                ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
              }}
              whileHover={{ y: -4, borderColor: "rgba(201,169,110,0.4)" }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 cursor-default transition-colors duration-300"
            >
              {type.icon}
              <span className="text-center text-xs font-medium leading-snug text-[var(--text-muted)]">
                {type.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
