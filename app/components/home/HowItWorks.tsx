"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../ui/AnimatedSection";

const steps = [
  {
    number: "01",
    title: "Choose a template",
    description:
      "Browse 30 cinematic templates across 3 tiers. Pick the one that matches your moment.",
  },
  {
    number: "02",
    title: "Fill your story",
    description:
      "Add your text, photos, music and personal touches. Your story in your words.",
  },
  {
    number: "03",
    title: "Share the link",
    description:
      "Get a beautiful link and QR code. Share it anywhere — instantly, forever.",
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.22,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.75,
      ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
    },
  },
};

export default function HowItWorks() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">Simple process</p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">How it works</h2>
        </AnimatedSection>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="grid grid-cols-1 gap-8 sm:grid-cols-3 sm:gap-6"
        >
          {steps.map((step, i) => (
            <motion.div key={step.number} variants={itemVariants} className="relative">
              <div className="flex flex-col items-center text-center sm:items-start sm:text-left p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] h-full transition-colors duration-300">
                <span className="text-5xl font-light text-[var(--gold)]/20 leading-none mb-6 select-none">
                  {step.number}
                </span>
                <h3 className="text-lg font-medium text-[var(--text)] mb-3">{step.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--text-muted)]">{step.description}</p>
              </div>

              {i < steps.length - 1 && (
                <div className="hidden sm:block absolute -right-3 top-1/2 -translate-y-1/2 w-6">
                  <svg width="24" height="4" viewBox="0 0 24 4" fill="none">
                    <motion.line
                      x1="0"
                      y1="2"
                      x2="24"
                      y2="2"
                      stroke="#c9a96e"
                      strokeWidth="0.8"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 0.4 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.9,
                        delay: i * 0.22 + 0.7,
                        ease: "easeInOut",
                      }}
                    />
                  </svg>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
