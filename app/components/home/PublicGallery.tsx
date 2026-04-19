"use client";

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
};

const samplePages = [
  {
    id: "1",
    title: "Min Thu & Aye Myat",
    type: "Wedding Celebration",
    slug: "min-thu-aye-myat",
    views: "2.4k",
    gradient: "from-[#1e1508] to-[#100c04]",
    accent: "#c9a96e",
    icon: "rings",
    date: "March 2025",
  },
  {
    id: "2",
    title: "Nanda's 25th Birthday",
    type: "Birthday Wish",
    slug: "nanda-25th",
    views: "1.1k",
    gradient: "from-[#180f18] to-[#0d080d]",
    accent: "#d4829a",
    icon: "candle",
    date: "January 2025",
  },
  {
    id: "3",
    title: "Cho & Kyaw — 10 Years",
    type: "Anniversary",
    slug: "cho-kyaw-10-years",
    views: "876",
    gradient: "from-[#0a1520] to-[#060d14]",
    accent: "#7ab8c9",
    icon: "heart",
    date: "February 2025",
  },
];

export default function PublicGallery() {
  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">Real stories</p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">From our community</h2>
          <p className="mt-4 text-sm text-[var(--text-muted)]">Beautiful pages created by people like you</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {samplePages.map((page, i) => (
            <motion.div
              key={page.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.75,
                delay: i * 0.15,
                ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
              }}
            >
              <Link
                href={`/p/${page.slug}`}
                className="group block overflow-hidden rounded-2xl border border-[var(--border)] hover:border-[var(--gold)]/20 transition-all duration-300"
              >
                <div
                  className={`relative h-48 bg-gradient-to-br ${page.gradient} flex flex-col items-center justify-center gap-4`}
                >
                  {icons[page.icon](page.accent)}
                  <p
                    className="text-sm font-light tracking-wide text-center px-4"
                    style={{ color: page.accent }}
                  >
                    {page.title}
                  </p>
                </div>

                <div className="bg-[var(--surface)] px-5 py-4 transition-colors duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-[var(--text)] group-hover:text-[var(--gold-light)] transition-colors duration-200 leading-snug">
                        {page.title}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{page.type}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-[var(--gold)]">{page.views}</p>
                      <p className="text-[10px] text-[var(--text-faint)]">views</p>
                    </div>
                  </div>
                  <p className="text-[10px] text-[var(--text-faint)] mt-3">{page.date}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
