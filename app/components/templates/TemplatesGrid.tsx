'use client'

import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TemplateCard, { PAGE_TYPE_LABELS } from './TemplateCard'
import TemplatePreviewModal from './TemplatePreviewModal'
import type { TemplateWithTier } from './TemplateCard'

const TIERS = ['All', 'Luxury', 'Premium', 'Basic'] as const
type TierFilter = (typeof TIERS)[number]

const PAGE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'wedding_celebration', label: 'Wedding' },
  { value: 'birthday_wish', label: 'Birthday' },
  { value: 'wedding_invitation', label: 'Invitation' },
  { value: 'anniversary', label: 'Anniversary' },
  { value: 'memorial_tribute', label: 'Memorial' },
  { value: 'love_letter', label: 'Love Letter' },
  { value: 'gender_reveal', label: 'Gender Reveal' },
  { value: 'birthday_invitation', label: 'Bday Invite' },
  { value: 'ceremony_invitation', label: 'Ceremony' },
  { value: 'custom_page', label: 'Custom' },
]

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className="shrink-0 px-3 py-1.5 rounded-lg text-[11px] tracking-wide transition-all duration-200"
      style={{
        background: active ? 'rgba(201,169,110,0.12)' : 'transparent',
        border: active ? '1px solid rgba(201,169,110,0.35)' : '1px solid rgba(255,255,255,0.06)',
        color: active ? '#c9a96e' : '#5a4a3a',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.borderColor = 'rgba(201,169,110,0.2)'
          el.style.color = '#8a7a68'
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          const el = e.currentTarget as HTMLButtonElement
          el.style.borderColor = 'rgba(255,255,255,0.06)'
          el.style.color = '#5a4a3a'
        }
      }}
    >
      {children}
    </button>
  )
}

type Props = {
  templates: TemplateWithTier[]
}

export default function TemplatesGrid({ templates }: Props) {
  const [tierFilter, setTierFilter] = useState<TierFilter>('All')
  const [pageTypeFilter, setPageTypeFilter] = useState('all')
  const [previewTemplate, setPreviewTemplate] = useState<TemplateWithTier | null>(null)

  const filtered = useMemo(() => {
    return templates.filter((t) => {
      const matchesTier = tierFilter === 'All' || t.tiers?.name === tierFilter
      const matchesType = pageTypeFilter === 'all' || t.page_type === pageTypeFilter
      return matchesTier && matchesType
    })
  }, [templates, tierFilter, pageTypeFilter])

  return (
    <>
      {/* Filter bar */}
      <div className="space-y-3 mb-10">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-[10px] tracking-widest uppercase mr-1" style={{ color: '#3a2a1a' }}>
            Tier
          </span>
          {TIERS.map((tier) => (
            <FilterButton
              key={tier}
              active={tierFilter === tier}
              onClick={() => setTierFilter(tier)}
            >
              {tier}
            </FilterButton>
          ))}
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="shrink-0 text-[10px] tracking-widest uppercase mr-1" style={{ color: '#3a2a1a' }}>
            Type
          </span>
          {PAGE_TYPES.map((pt) => (
            <FilterButton
              key={pt.value}
              active={pageTypeFilter === pt.value}
              onClick={() => setPageTypeFilter(pt.value)}
            >
              {pt.label}
            </FilterButton>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-xs" style={{ color: '#4a3a28' }}>
          {filtered.length} template{filtered.length !== 1 ? 's' : ''}
          {(tierFilter !== 'All' || pageTypeFilter !== 'all') && (
            <button
              onClick={() => { setTierFilter('All'); setPageTypeFilter('all') }}
              className="ml-3 text-[10px] tracking-wide transition-colors"
              style={{ color: '#c9a96e' }}
            >
              Clear filters
            </button>
          )}
        </p>
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        {filtered.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-24 text-center"
          >
            <p className="text-sm font-light mb-2" style={{ color: '#5a4a3a' }}>No templates match your filters</p>
            <button
              onClick={() => { setTierFilter('All'); setPageTypeFilter('all') }}
              className="text-xs tracking-wide transition-colors"
              style={{ color: '#c9a96e' }}
            >
              Clear filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={`${tierFilter}-${pageTypeFilter}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
          >
            {filtered.map((template, i) => (
              <TemplateCard
                key={template.id}
                template={template}
                index={i}
                onPreview={setPreviewTemplate}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <TemplatePreviewModal
        template={previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </>
  )
}
