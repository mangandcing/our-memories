'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'

const PAGE_TYPE_LABELS: Record<string, string> = {
  wedding_celebration: 'Wedding Celebration',
  birthday_wish: 'Birthday Wish',
  wedding_invitation: 'Wedding Invitation',
  anniversary: 'Anniversary',
  memorial_tribute: 'Memorial & Tribute',
  love_letter: 'Love Letter',
  gender_reveal: 'Gender Reveal',
  birthday_invitation: 'Birthday Invitation',
  ceremony_invitation: 'Ceremony Invitation',
  custom_page: 'Custom Page',
}

const TIER_STYLES: Record<string, string> = {
  Basic: 'text-[var(--text-muted)] border-[var(--border-hover)]',
  Premium: 'text-[var(--gold)] border-[var(--gold)]/25',
  Luxury: 'text-[#d4af37] border-[#d4af37]/30',
}

function TypeIcon({ pageType, color }: { pageType: string; color: string }) {
  const props = {
    viewBox: '0 0 24 24',
    className: 'w-8 h-8',
    fill: 'none',
    stroke: color,
    strokeWidth: '1.2',
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (pageType) {
    case 'wedding_celebration':
    case 'wedding_invitation':
      return (
        <svg {...props}>
          <circle cx="9.5" cy="12" r="4.5" />
          <circle cx="14.5" cy="12" r="4.5" />
        </svg>
      )
    case 'birthday_wish':
    case 'birthday_invitation':
      return (
        <svg {...props}>
          <path d="M12 9.5 C13.5 8 13.5 6 12 5 C10.5 6 10.5 8 12 9.5Z" />
          <line x1="12" y1="9.5" x2="12" y2="12" />
          <rect x="9" y="12" width="6" height="7" rx="0.5" />
        </svg>
      )
    case 'anniversary':
      return (
        <svg {...props}>
          <path d="M12 19 C12 19 3.5 14 3.5 8.5 C3.5 6 5.8 4 8.5 4 C10.2 4 11.5 5 12 6 C12.5 5 13.8 4 15.5 4 C18.2 4 20.5 6 20.5 8.5 C20.5 14 12 19 12 19Z" />
        </svg>
      )
    case 'memorial_tribute':
      return (
        <svg {...props}>
          <path d="M12 3 L12 8" />
          <path d="M9 5.5 L15 5.5" />
          <path d="M8 8 C8 8 6 10 6 14 C6 18 9 21 12 21 C15 21 18 18 18 14 C18 10 16 8 16 8 Z" />
        </svg>
      )
    case 'love_letter':
      return (
        <svg {...props}>
          <path d="M20 4 C16 5 9 12 6 20" />
          <path d="M20 4 C19 7 16 11 6 20" />
          <line x1="6" y1="20" x2="4" y2="18" />
          <line x1="6" y1="20" x2="5" y2="22" />
        </svg>
      )
    default:
      return (
        <svg {...props}>
          <rect x="3" y="7" width="18" height="13" rx="1" />
          <path d="M3 7.5 L12 14 L21 7.5" />
        </svg>
      )
  }
}

function IconArrow({ color }: { color: string }) {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export interface DemoCardProps {
  slug: string
  title: string
  pageType: string
  tierName: string
  templateName: string
  accentColor: string
  bgColor: string
  index: number
}

export default function DemoCard({
  slug,
  title,
  pageType,
  tierName,
  templateName,
  accentColor,
  bgColor,
  index,
}: DemoCardProps) {
  const typeLabel = PAGE_TYPE_LABELS[pageType] ?? pageType
  const tierStyle = TIER_STYLES[tierName] ?? TIER_STYLES.Basic
  const thumbnailGradient = `linear-gradient(135deg, ${bgColor} 0%, ${accentColor}22 80%, ${accentColor}10 100%)`
  const glowColor = `${accentColor}28`

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.65,
        delay: Math.min(index * 0.09, 0.54),
        ease: [0.25, 0.1, 0.25, 1],
      }}
    >
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.2, ease: 'easeOut' }}
        className="group overflow-hidden rounded-2xl border border-[var(--border)] hover:border-[var(--border-hover)] bg-[var(--surface)] transition-colors duration-300"
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = `0 10px 40px ${glowColor}`
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.boxShadow = 'none'
        }}
      >
        <div
          className="relative h-52 flex flex-col items-center justify-center gap-3 px-6 overflow-hidden"
          style={{ background: thumbnailGradient }}
        >
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${accentColor}18 0%, transparent 70%)`,
            }}
          />

          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <span className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-white/60 border border-white/5">
              {typeLabel}
            </span>
            <span className={`text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border ${tierStyle}`}>
              {tierName}
            </span>
          </div>

          <TypeIcon pageType={pageType} color={accentColor} />

          <div className="w-8 h-px" style={{ backgroundColor: accentColor, opacity: 0.4 }} />

          <p
            className="text-sm font-light tracking-wide text-center line-clamp-2 leading-relaxed px-2"
            style={{ color: accentColor }}
          >
            {title}
          </p>

          <div className="w-8 h-px" style={{ backgroundColor: accentColor, opacity: 0.4 }} />

          <div
            className="absolute bottom-0 left-0 right-0 h-px opacity-20 group-hover:opacity-50 transition-opacity duration-300"
            style={{ background: accentColor }}
          />
        </div>

        <div className="px-5 py-4">
          <p className="text-sm font-medium text-[var(--text)] truncate group-hover:text-[var(--gold-light)] transition-colors duration-200">
            {title}
          </p>
          <p className="text-[11px] text-[var(--text-faint)] mt-0.5 truncate">{templateName}</p>

          <Link
            href={`/p/${slug}`}
            className="mt-4 inline-flex items-center gap-2 text-xs tracking-wide transition-opacity duration-200 hover:opacity-70"
            style={{ color: accentColor }}
          >
            Experience Demo
            <IconArrow color={accentColor} />
          </Link>
        </div>
      </motion.div>
    </motion.div>
  )
}
