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
  Basic: 'text-[#7a7268] border-[#3a3a3a]',
  Premium: 'text-[#c9a96e] border-[#c9a96e]/25',
  Luxury: 'text-[#d4af37] border-[#d4af37]/30',
}

function IconEye() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}

function IconArrow() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

export interface GalleryCardProps {
  slug: string
  title: string
  pageType: string
  tierName: string
  templateName: string
  accentColor: string
  bgColor: string
  viewCount: number
  index: number
}

export default function GalleryCard({
  slug,
  title,
  pageType,
  tierName,
  templateName,
  accentColor,
  bgColor,
  viewCount,
  index,
}: GalleryCardProps) {
  const thumbnailGradient = `linear-gradient(135deg, ${bgColor} 0%, ${accentColor}28 60%, ${accentColor}10 100%)`
  const glowColor = `${accentColor}30`
  const typeLabel = PAGE_TYPE_LABELS[pageType] ?? pageType
  const tierStyle = TIER_STYLES[tierName] ?? TIER_STYLES.Basic

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: Math.min(index * 0.07, 0.42), ease: [0.25, 0.1, 0.25, 1] }}
    >
      <Link href={`/p/${slug}`} className="group block">
        <motion.div
          whileHover={{ y: -4 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface)] transition-all duration-300 group-hover:border-[var(--border-hover)]"
          style={{
            boxShadow: '0 0 0 0 transparent',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${glowColor}`
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 0 0 0 transparent'
          }}
        >
          {/* Thumbnail */}
          <div
            className="relative h-44 flex flex-col items-center justify-center gap-3 px-6"
            style={{ background: thumbnailGradient }}
          >
            {/* Badges */}
            <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
              <span className="text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm text-[#f5e6c8]/60 border border-[#ffffff]/5">
                {typeLabel}
              </span>
              <span className={`text-[10px] tracking-[0.12em] uppercase px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-sm border ${tierStyle}`}>
                {tierName}
              </span>
            </div>

            {/* Decorative accent line */}
            <div
              className="w-8 h-px"
              style={{ backgroundColor: accentColor, opacity: 0.5 }}
            />

            {/* Title preview */}
            <p
              className="text-sm font-light tracking-wide text-center leading-snug line-clamp-2 px-2"
              style={{ color: accentColor }}
            >
              {title}
            </p>

            {/* Decorative accent line */}
            <div
              className="w-8 h-px"
              style={{ backgroundColor: accentColor, opacity: 0.5 }}
            />

            {/* View button — appears on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-black/20">
              <span
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-medium border backdrop-blur-sm transition-colors"
                style={{
                  borderColor: `${accentColor}50`,
                  color: accentColor,
                  backgroundColor: 'rgba(0,0,0,0.5)',
                }}
              >
                View
                <IconArrow />
              </span>
            </div>
          </div>

          {/* Card body */}
          <div className="px-4 py-3.5">
            <p className="text-sm font-medium text-[var(--text)] leading-snug truncate group-hover:text-[var(--gold-light)] transition-colors duration-200">
              {title}
            </p>
            <p className="text-[11px] text-[var(--text-faint)] mt-0.5 truncate">{templateName}</p>

            {viewCount > 0 && (
              <div className="flex items-center gap-1 mt-2.5 text-[var(--text-faint)]">
                <IconEye />
                <span className="text-[10px]">{viewCount.toLocaleString()} views</span>
              </div>
            )}
          </div>
        </motion.div>
      </Link>
    </motion.div>
  )
}
