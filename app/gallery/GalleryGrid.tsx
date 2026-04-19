'use client'

import { useState, useMemo } from 'react'
import GalleryCard from './GalleryCard'

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

const PAGE_SIZE = 12

export interface GalleryPageData {
  id: string
  slug: string
  title: string
  view_count: number
  page_type: string
  tier_name: string
  template_name: string
  accent_color: string
  bg_color: string
}

interface Props {
  pages: GalleryPageData[]
}

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3.5 min-h-[44px] flex items-center rounded-full text-xs tracking-wide transition-all duration-200 border ${
        active
          ? 'border-[var(--gold)]/60 text-[var(--gold)] bg-[var(--gold)]/8'
          : 'border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--border-hover)] hover:text-[var(--text)]'
      }`}
    >
      {label}
    </button>
  )
}

function IconChevronDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  )
}

export default function GalleryGrid({ pages }: Props) {
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [tierFilter, setTierFilter] = useState<string>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const availableTypes = useMemo(() => {
    const types = Array.from(new Set(pages.map((p) => p.page_type)))
    return types.sort()
  }, [pages])

  const availableTiers = useMemo(() => {
    const tiers = Array.from(new Set(pages.map((p) => p.tier_name)))
    return tiers.sort()
  }, [pages])

  const filtered = useMemo(() => {
    return pages.filter((p) => {
      const matchType = typeFilter === 'all' || p.page_type === typeFilter
      const matchTier = tierFilter === 'all' || p.tier_name === tierFilter
      return matchType && matchTier
    })
  }, [pages, typeFilter, tierFilter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleTypeChange(type: string) {
    setTypeFilter(type)
    setVisibleCount(PAGE_SIZE)
  }

  function handleTierChange(tier: string) {
    setTierFilter(tier)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="mb-10 space-y-4">
        {availableTypes.length > 1 && (
          <div className="flex gap-2 items-center overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--text-faint)] mr-1 shrink-0 whitespace-nowrap">Type</span>
            <FilterPill label="All" active={typeFilter === 'all'} onClick={() => handleTypeChange('all')} />
            {availableTypes.map((t) => (
              <FilterPill
                key={t}
                label={PAGE_TYPE_LABELS[t] ?? t}
                active={typeFilter === t}
                onClick={() => handleTypeChange(t)}
              />
            ))}
          </div>
        )}

        {availableTiers.length > 1 && (
          <div className="flex gap-2 items-center overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[var(--text-faint)] mr-1 shrink-0 whitespace-nowrap">Tier</span>
            <FilterPill label="All" active={tierFilter === 'all'} onClick={() => handleTierChange('all')} />
            {availableTiers.map((t) => (
              <FilterPill
                key={t}
                label={t}
                active={tierFilter === t}
                onClick={() => handleTierChange(t)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Grid */}
      {visible.length === 0 ? (
        <div className="py-24 flex flex-col items-center gap-4 text-center">
          <div className="w-12 h-12 rounded-full border border-[var(--border)] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <path d="M3 9h18M9 21V9" />
            </svg>
          </div>
          <p className="text-sm text-[var(--text-faint)]">No pages match your selection</p>
          <button
            onClick={() => { setTypeFilter('all'); setTierFilter('all') }}
            className="text-xs text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-5 space-y-0">
          {visible.map((page, i) => (
            <div key={page.id} className="break-inside-avoid mb-5">
              <GalleryCard
                slug={page.slug}
                title={page.title}
                pageType={page.page_type}
                tierName={page.tier_name}
                templateName={page.template_name}
                accentColor={page.accent_color}
                bgColor={page.bg_color}
                viewCount={page.view_count}
                index={i}
              />
            </div>
          ))}
        </div>
      )}

      {/* Load more */}
      {hasMore && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-[var(--border)] text-xs text-[var(--text-muted)] hover:border-[var(--gold)]/30 hover:text-[var(--gold)] transition-all duration-200"
          >
            Load more
            <IconChevronDown />
          </button>
        </div>
      )}

      {/* Count */}
      {filtered.length > 0 && (
        <p className="mt-8 text-center text-[10px] text-[var(--text-faint)]">
          Showing {Math.min(visibleCount, filtered.length)} of {filtered.length} pages
        </p>
      )}
    </div>
  )
}
