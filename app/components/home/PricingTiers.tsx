"use client";

import { motion } from "framer-motion";
import AnimatedSection from "../ui/AnimatedSection";
import { createClient } from "@/app/lib/supabase";
import { useEffect, useState } from "react";

interface Tier {
  id: string;
  name: string;
  features: string[];
  sort_order: number;
}

interface DurationPrice {
  tier_id: string;
  duration_months: number;
  price: number;
  label: string;
}

const tierMeta: Record<
  string,
  { description: string; highlight: boolean; badge?: string; placeholderPrice: string; placeholderFeatures: string[] }
> = {
  Basic: {
    description: "Text content, gift section, and 10 elegant templates.",
    highlight: false,
    placeholderPrice: "15,000 MMK",
    placeholderFeatures: [
      "Story section",
      "Text content",
      "Gift section",
      "10+ templates",
      "QR code",
    ],
  },
  Premium: {
    description: "Photos, music, countdown timer, and PDF export included.",
    highlight: true,
    badge: "Most Popular",
    placeholderPrice: "35,000 MMK",
    placeholderFeatures: [
      "Everything in Basic",
      "Photo gallery (50MB)",
      "Background music",
      "Countdown timer",
      "PDF export",
      "20+ templates",
    ],
  },
  Luxury: {
    description: "Video, games, collaboration tools, and custom domain.",
    highlight: false,
    placeholderPrice: "65,000 MMK",
    placeholderFeatures: [
      "Everything in Premium",
      "Full-screen video",
      "Interactive games",
      "Collaboration",
      "Custom domain",
      "Priority review",
      "30 templates",
    ],
  },
};

const CheckIcon = () => (
  <svg
    viewBox="0 0 12 12"
    className="w-3 h-3 mt-0.5 shrink-0"
    fill="none"
    stroke="#c9a96e"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="2,6 5,9 10,3" />
  </svg>
);

export default function PricingTiers() {
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [prices, setPrices] = useState<DurationPrice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("tiers").select("*").eq("is_active", true).order("sort_order"),
      supabase.from("duration_prices").select("*").eq("is_active", true),
    ]).then(([tiersRes, pricesRes]) => {
      if (tiersRes.data) setTiers(tiersRes.data);
      if (pricesRes.data) setPrices(pricesRes.data);
      setLoading(false);
    });
  }, []);

  const getStartingPrice = (tierId: string) => {
    const tierPrices = prices.filter((p) => p.tier_id === tierId);
    if (!tierPrices.length) return null;
    return Math.min(...tierPrices.map((p) => p.price));
  };

  const fallbackTiers = [
    { id: "basic", name: "Basic", features: tierMeta.Basic.placeholderFeatures, sort_order: 1 },
    { id: "premium", name: "Premium", features: tierMeta.Premium.placeholderFeatures, sort_order: 2 },
    { id: "luxury", name: "Luxury", features: tierMeta.Luxury.placeholderFeatures, sort_order: 3 },
  ];

  const displayTiers = loading
    ? [
        { id: "1", name: "Basic", features: [], sort_order: 1 },
        { id: "2", name: "Premium", features: [], sort_order: 2 },
        { id: "3", name: "Luxury", features: [], sort_order: 3 },
      ]
    : tiers.length > 0
    ? tiers
    : fallbackTiers;

  return (
    <section className="px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-5xl">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)] mb-4">Flexible plans</p>
          <h2 className="text-3xl font-light text-[var(--text)] sm:text-4xl">Choose your tier</h2>
          <p className="mt-4 text-sm text-[var(--text-muted)]">All prices in Myanmar Kyat (MMK)</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 sm:items-start">
          {displayTiers.map((tier, i) => {
            const meta = tierMeta[tier.name] ?? { description: "", highlight: false };
            const startingPrice = getStartingPrice(tier.id);

            return (
              <motion.div
                key={tier.id}
                initial={{ opacity: 0, y: 80 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{
                  type: "spring",
                  stiffness: 90,
                  damping: 18,
                  delay: i * 0.15,
                }}
                className={`relative flex flex-col rounded-2xl p-8 transition-colors duration-300 ${
                  meta.highlight
                    ? "border border-[var(--gold)]/40 bg-[var(--surface)] sm:scale-105 sm:-mt-2 sm:-mb-2"
                    : "border border-[var(--border)] bg-[var(--surface)]"
                }`}
              >
                {meta.highlight && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{
                      boxShadow: [
                        "0 0 0px rgba(201,169,110,0)",
                        "0 0 45px rgba(201,169,110,0.22), 0 0 90px rgba(201,169,110,0.06)",
                        "0 0 0px rgba(201,169,110,0)",
                      ],
                    }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
                  />
                )}

                {meta.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-[#c9a96e] px-4 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#0a0a0a]">
                    {meta.badge}
                  </span>
                )}

                <h3 className="text-xl font-medium text-[var(--text)]">{tier.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">{meta.description}</p>

                <div className="mt-6 mb-8">
                  {loading ? (
                    <div className="h-8 w-32 rounded-md bg-[var(--border)] animate-pulse" />
                  ) : startingPrice !== null ? (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Starting from</span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-2xl font-light text-[var(--gold)]">
                          {startingPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-[var(--text-muted)]">MMK</span>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <span className="text-xs text-[var(--text-muted)]">Starting from</span>
                      <div className="mt-1">
                        <span className="text-2xl font-light text-[var(--gold)]">
                          {meta.placeholderPrice}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {tier.features.length > 0 && (
                  <ul className="space-y-2.5 mb-8">
                    {tier.features.map((feature: string) => (
                      <li key={feature} className="flex items-start gap-2.5 text-xs text-[var(--text-muted)]">
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                )}

                <button
                  className={`mt-auto w-full rounded-full py-3 min-h-[44px] text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105 active:scale-95 ${
                    meta.highlight
                      ? "bg-[var(--gold)] text-[var(--bg)] hover:bg-[var(--gold-light)]"
                      : "border border-[var(--gold)]/30 text-[var(--text)] hover:border-[var(--gold)]/60 hover:bg-[var(--gold)]/5"
                  }`}
                >
                  Get started
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
