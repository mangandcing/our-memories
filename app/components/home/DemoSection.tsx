"use client";

import { useEffect, useMemo, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedSection from "../ui/AnimatedSection";
import React from "react";

type IconFn = (color: string) => React.ReactNode;

const icons: Record<string, IconFn> = {
  rings: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9.5" cy="12" r="4.5" />
      <circle cx="14.5" cy="12" r="4.5" />
    </svg>
  ),
  candle: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 9.5 C13.5 8 13.5 6 12 5 C10.5 6 10.5 8 12 9.5Z" />
      <line x1="12" y1="9.5" x2="12" y2="12" />
      <rect x="9" y="12" width="6" height="7" rx="0.5" />
    </svg>
  ),
  heart: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19 C12 19 3.5 14 3.5 8.5 C3.5 6 5.8 4 8.5 4 C10.2 4 11.5 5 12 6 C12.5 5 13.8 4 15.5 4 C18.2 4 20.5 6 20.5 8.5 C20.5 14 12 19 12 19Z" />
    </svg>
  ),
  quill: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 4 C16 5 9 12 6 20" />
      <path d="M20 4 C19 7 16 11 6 20" />
      <line x1="6" y1="20" x2="4" y2="18" />
      <line x1="6" y1="20" x2="5" y2="22" />
    </svg>
  ),
  candle_memorial: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 3 L12 8" />
      <path d="M9 5.5 L15 5.5" />
      <path d="M8 8 C8 8 6 10 6 14 C6 18 9 21 12 21 C15 21 18 18 18 14 C18 10 16 8 16 8 Z" />
    </svg>
  ),
  envelope: (c) => (
    <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke={c} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="7" width="18" height="13" rx="1" />
      <path d="M3 7.5 L12 14 L21 7.5" />
    </svg>
  ),
};

const PAGE_TYPE_ICON: Record<string, string> = {
  wedding_celebration: "rings",
  wedding_invitation: "envelope",
  birthday_wish: "candle",
  birthday_invitation: "candle",
  anniversary: "heart",
  love_letter: "quill",
  memorial_tribute: "candle_memorial",
};

const DEMO_COLORS: Record<string, { gradient: string; accent: string }> = {
  "royal-wedding":      { gradient: "from-[#1a0a2e] to-[#0d0519]",   accent: "#c9a96e" },
  "milestone-birthday": { gradient: "from-[#1a0a14] to-[#0d0510]",   accent: "#d4729a" },
  "garden-romance":     { gradient: "from-[#0a1a10] to-[#050e08]",   accent: "#7aad8a" },
  "gentle-farewell":    { gradient: "from-[#0a0f1a] to-[#06090f]",   accent: "#9ba8b8" },
  "eternal-devotion":   { gradient: "from-[#1a0a0a] to-[#0d0505]",   accent: "#c96e7a" },
  "forever-and-always": { gradient: "from-[#0a1a1a] to-[#050e0e]",   accent: "#6ebfbf" },
};

interface DemoRow {
  id: string;
  slug: string;
  title: string;
  template: { name: string; slug: string; page_type: string } | null;
}

function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--border)] animate-pulse">
      <div className="h-44 bg-[var(--surface)]" />
      <div className="bg-[var(--surface)] px-5 py-4 space-y-2">
        <div className="h-3 bg-[var(--border)] rounded w-3/4" />
        <div className="h-2.5 bg-[var(--border)] rounded w-1/2" />
      </div>
    </div>
  );
}

export default function DemoSection() {
  const [demos, setDemos] = useState<DemoRow[] | null>(null);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  );

  useEffect(() => {
    supabase
      .from("pages")
      .select(`
        id, slug, title,
        templates!pages_template_id_fkey (name, slug, page_type)
      `)
      .eq("demo", true)
      .eq("is_published", true)
      .order("created_at")
      .limit(6)
      .then(({ data }) => {
        setDemos(
          (data ?? []).map((row) => ({
            id: row.id,
            slug: row.slug,
            title: row.title,
            template: row.templates as unknown as DemoRow["template"],
          }))
        );
      });
  }, [supabase]);

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">See it in action</p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">Live demos</h2>
          <p className="mt-4 text-sm text-[var(--text-muted)]">Explore example pages before you create yours</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-5">
          {demos === null ? (
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            demos.map((demo, i) => {
              const templateSlug = demo.template?.slug ?? "";
              const pageType = demo.template?.page_type ?? "";
              const templateName = demo.template?.name ?? "";
              const colors = DEMO_COLORS[templateSlug] ?? {
                gradient: "from-[#1a1408] to-[#0a0a0a]",
                accent: "#c9a96e",
              };
              const iconKey = PAGE_TYPE_ICON[pageType] ?? "envelope";
              const iconFn = icons[iconKey];

              return (
                <motion.div
                  key={demo.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -60 : 60 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.15 }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.08,
                    ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
                  }}
                >
                  <Link
                    href={`/p/${demo.slug}`}
                    className="group block overflow-hidden rounded-2xl border border-[var(--border)] hover:border-[var(--gold)]/20 transition-all duration-300"
                  >
                    <div
                      className={`relative h-44 bg-gradient-to-br ${colors.gradient} flex flex-col items-center justify-center gap-3 overflow-hidden`}
                    >
                      <motion.div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                        style={{
                          background: `radial-gradient(ellipse 50% 50% at 50% 50%, ${colors.accent}15 0%, transparent 70%)`,
                        }}
                      />
                      {iconFn(colors.accent)}
                      <span
                        className="text-xs tracking-widest uppercase font-medium"
                        style={{ color: colors.accent }}
                      >
                        {templateName}
                      </span>
                      <div
                        className="absolute bottom-0 left-0 right-0 h-px opacity-20 group-hover:opacity-50 transition-opacity duration-300"
                        style={{ background: colors.accent }}
                      />
                    </div>

                    <div className="bg-[var(--surface)] px-5 py-4 transition-colors duration-300">
                      <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--gold-light)] transition-colors duration-200 truncate">
                        {demo.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {demo.template?.page_type
                          ? demo.template.page_type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                          : ""}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          )}
        </div>

        {demos !== null && demos.length > 0 && (
          <AnimatedSection className="text-center mt-12">
            <Link
              href="/demos"
              className="inline-flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors duration-200"
            >
              View all demos
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </AnimatedSection>
        )}
      </div>
    </section>
  );
}
