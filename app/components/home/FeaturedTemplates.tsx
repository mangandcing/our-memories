"use client";

import { motion, useMotionValue } from "framer-motion";
import AnimatedSection from "../ui/AnimatedSection";

const templates = [
  {
    id: "1",
    name: "Golden Vows",
    type: "Wedding Celebration",
    tier: "Luxury",
    gradient: "from-[#2a1f0e] to-[#1a1208]",
    accent: "#c9a96e",
  },
  {
    id: "2",
    name: "Sakura Bloom",
    type: "Birthday Wish",
    tier: "Premium",
    gradient: "from-[#1f1018] to-[#120a10]",
    accent: "#d4829a",
  },
  {
    id: "3",
    name: "Eternal Bond",
    type: "Anniversary",
    tier: "Luxury",
    gradient: "from-[#0d1a1f] to-[#081014]",
    accent: "#7ab8c9",
  },
  {
    id: "4",
    name: "Paper Hearts",
    type: "Love Letter",
    tier: "Basic",
    gradient: "from-[#1f1515] to-[#120e0e]",
    accent: "#c97a7a",
  },
  {
    id: "5",
    name: "Starlight",
    type: "Birthday Invitation",
    tier: "Premium",
    gradient: "from-[#0d0d1f] to-[#08080f]",
    accent: "#9a8ac9",
  },
  {
    id: "6",
    name: "Morning Dew",
    type: "Wedding Invitation",
    tier: "Basic",
    gradient: "from-[#101a10] to-[#0a120a]",
    accent: "#7ab87a",
  },
];

const tierColors: Record<string, string> = {
  Basic: "text-[var(--text-muted)] border-[var(--border)]",
  Premium: "text-[var(--gold)] border-[var(--gold)]/30",
  Luxury: "text-[var(--gold-light)] border-[var(--gold-light)]/30",
};

function ShimmerCard({
  template,
  i,
}: {
  template: (typeof templates)[number];
  i: number;
}) {
  const shimmerBg = useMotionValue("none");

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    shimmerBg.set(
      `radial-gradient(circle 200px at ${e.clientX - left}px ${e.clientY - top}px, rgba(255,255,255,0.055) 0%, transparent 70%)`
    );
  }

  function onMouseLeave() {
    shimmerBg.set("none");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 35 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.7,
        delay: i * 0.1,
        ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -7 }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className="group relative overflow-hidden rounded-2xl border border-[var(--border)] cursor-pointer transition-colors duration-300 hover:border-[var(--gold)]/15"
    >
      <div
        className={`relative h-52 bg-gradient-to-br ${template.gradient} flex items-center justify-center overflow-hidden`}
      >
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: shimmerBg }}
        />
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse 55% 55% at 50% 50%, ${template.accent}15 0%, transparent 70%)`,
          }}
        />
        <div className="relative z-10 text-center px-6">
          <motion.div
            className="w-8 h-px mx-auto mb-4"
            style={{ background: template.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 + 0.3 }}
          />
          <p className="text-lg font-light tracking-wide" style={{ color: template.accent }}>
            {template.name}
          </p>
          <motion.div
            className="w-8 h-px mx-auto mt-4"
            style={{ background: template.accent }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.1 + 0.45 }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between bg-[var(--surface)] px-5 py-4 transition-colors duration-300">
        <div>
          <p className="text-sm font-medium text-[var(--text)]">{template.name}</p>
          <p className="text-xs text-[var(--text-muted)] mt-0.5">{template.type}</p>
        </div>
        <span
          className={`rounded-full border px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider ${tierColors[template.tier]}`}
        >
          {template.tier}
        </span>
      </div>
    </motion.div>
  );
}

export default function FeaturedTemplates() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">
            Handcrafted designs
          </p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">Featured templates</h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {templates.map((template, i) => (
            <ShimmerCard key={template.id} template={template} i={i} />
          ))}
        </div>

        <AnimatedSection delay={0.2} className="text-center mt-10">
          <a
            href="/templates"
            className="inline-flex items-center gap-2 text-sm text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors duration-200"
          >
            View all 30 templates
            <span className="text-base">→</span>
          </a>
        </AnimatedSection>
      </div>
    </section>
  );
}
