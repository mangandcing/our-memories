"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const words = [
  { text: "Every", gold: false },
  { text: "moment", gold: false },
  { text: "deserves", gold: true },
  { text: "a", gold: false },
  { text: "beautiful", gold: false },
  { text: "page", gold: false },
];

const particles = [
  { x: "12%", y: "22%", size: 1.5, delay: 0, duration: 9 },
  { x: "80%", y: "16%", size: 1, delay: 1.8, duration: 12 },
  { x: "55%", y: "70%", size: 2, delay: 0.9, duration: 10 },
  { x: "90%", y: "52%", size: 1.5, delay: 3, duration: 14 },
  { x: "20%", y: "65%", size: 1, delay: 1.5, duration: 11 },
  { x: "68%", y: "38%", size: 1.2, delay: 4, duration: 8 },
  { x: "36%", y: "14%", size: 1, delay: 0.5, duration: 13 },
  { x: "8%", y: "45%", size: 1.5, delay: 2.5, duration: 9 },
];

const wordVariants = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] },
  },
};

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: {
    duration: 0.8,
    delay,
    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  },
});

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="absolute inset-0 -z-10"
        style={{ background: "var(--hero-gradient)" }}
      />

      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(ellipse 55% 45% at 30% 40%, #c9a96e0a 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 45% at 70% 55%, #c9a96e10 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 45% at 45% 30%, #c9a96e08 0%, transparent 70%)",
            "radial-gradient(ellipse 55% 45% at 30% 40%, #c9a96e0a 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />

      {particles.map((p, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#c9a96e] -z-10"
          style={{ left: p.x, top: p.y, width: p.size, height: p.size }}
          animate={{ y: [0, -18, 0], opacity: [0.2, 0.7, 0.2] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      <motion.p
        {...fadeUp(0.1)}
        className="mb-8 text-xs tracking-[0.35em] uppercase text-[var(--gold)] font-medium"
      >
        Our Memories
      </motion.p>

      <motion.h1
        variants={{ animate: { transition: { staggerChildren: 0.07, delayChildren: 0.3 } } }}
        initial="initial"
        animate="animate"
        className="max-w-4xl text-4xl font-light leading-tight tracking-tight text-[var(--text)] sm:text-6xl lg:text-7xl"
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className={`inline-block mr-[0.22em] ${word.gold ? "text-[var(--gold)]" : ""}`}
          >
            {word.text}
          </motion.span>
        ))}
      </motion.h1>

      <motion.p
        {...fadeUp(0.85)}
        className="mt-7 max-w-lg text-base leading-relaxed text-[var(--text-muted)] sm:text-lg"
      >
        Create cinematic celebration pages for weddings, birthdays, anniversaries
        and every precious moment worth sharing.
      </motion.p>

      <motion.div
        {...fadeUp(1.05)}
        className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5"
      >
        <Link
          href="/templates"
          className="inline-flex items-center justify-center rounded-full bg-[#c9a96e] px-8 py-3.5 min-h-[44px] text-sm font-medium tracking-wide text-[#0a0a0a] transition-all duration-300 hover:bg-[#e8c98a] hover:scale-105 active:scale-95"
        >
          Browse Templates
        </Link>
        <Link
          href="/demos"
          className="inline-flex items-center justify-center rounded-full border border-[var(--gold)]/30 px-8 py-3.5 min-h-[44px] text-sm font-medium tracking-wide text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5 hover:scale-105 active:scale-95"
        >
          View Demo
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]/50">Scroll</span>
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-[#c9a96e]/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}
