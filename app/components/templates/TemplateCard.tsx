'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import SectionBadge from './SectionBadge'

export type RendererConfig = {
  theme?: {
    heroGradient?: string
    accent?: string
    primary?: string
    background?: string
  }
  sections?: string[]
  animations?: string
}

export type TemplateWithTier = {
  id: string
  name: string
  slug: string
  page_type: string
  thumbnail_url: string | null
  renderer_config: RendererConfig
  tiers: {
    id: string
    name: string
    sort_order: number
  }
}

export const PAGE_TYPE_LABELS: Record<string, string> = {
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

function TierBadge({ name }: { name: string }) {
  if (name === 'Luxury') {
    return (
      <span
        className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[9px] tracking-widest uppercase font-medium"
        style={{
          background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(201,169,110,0.15))',
          border: '1px solid rgba(168,85,247,0.35)',
          color: '#c8a0f0',
        }}
      >
        Luxury
      </span>
    )
  }
  if (name === 'Premium') {
    return (
      <span
        className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[9px] tracking-widest uppercase font-medium"
        style={{
          background: 'rgba(201,169,110,0.08)',
          border: '1px solid rgba(201,169,110,0.3)',
          color: '#c9a96e',
        }}
      >
        Premium
      </span>
    )
  }
  return (
    <span
      className="shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[9px] tracking-widest uppercase font-medium"
      style={{
        background: 'rgba(160,160,160,0.08)',
        border: '1px solid rgba(160,160,160,0.25)',
        color: '#909090',
      }}
    >
      Basic
    </span>
  )
}

type Props = {
  template: TemplateWithTier
  index: number
  onPreview: (template: TemplateWithTier) => void
}

export default function TemplateCard({ template, index, onPreview }: Props) {
  const gradient = template.renderer_config?.theme?.heroGradient
    ?? 'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #0d0a04 40%, #0a0a0a 100%)'
  const accent = template.renderer_config?.theme?.accent ?? '#c9a96e'
  const tierName = template.tiers?.name ?? 'Basic'

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group flex flex-col rounded-2xl overflow-hidden"
      style={{
        background: '#111111',
        border: '1px solid #1e1e1e',
        boxShadow: '0 0 0 0 transparent',
        transition: 'border-color 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = `${accent}40`
        el.style.boxShadow = `0 8px 32px ${accent}12`
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLElement
        el.style.borderColor = '#1e1e1e'
        el.style.boxShadow = '0 0 0 0 transparent'
      }}
    >
      {/* Gradient thumbnail */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer"
        style={{ background: gradient }}
        onClick={() => onPreview(template)}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 select-none">
          <div className="w-10 h-px" style={{ background: `${accent}80` }} />
          <div className="text-center space-y-1.5">
            <div className="h-2 w-28 rounded-full mx-auto" style={{ background: `${accent}50` }} />
            <div className="h-1.5 w-20 rounded-full mx-auto" style={{ background: `${accent}28` }} />
            <div className="h-1.5 w-16 rounded-full mx-auto" style={{ background: `${accent}18` }} />
          </div>
          <div className="w-10 h-px" style={{ background: `${accent}80` }} />
          <div className="flex gap-1.5 mt-1">
            <div className="w-8 h-1 rounded-full" style={{ background: `${accent}30` }} />
            <div className="w-5 h-1 rounded-full" style={{ background: `${accent}20` }} />
            <div className="w-6 h-1 rounded-full" style={{ background: `${accent}20` }} />
          </div>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: 'rgba(0,0,0,0.55)' }}
        >
          <span
            className="px-4 py-2 rounded-full text-[10px] tracking-widest uppercase border"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.85)' }}
          >
            Preview
          </span>
        </div>
      </div>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-light leading-snug" style={{ color: '#f5e6c8' }}>
            {template.name}
          </h3>
          <TierBadge name={tierName} />
        </div>

        <p className="text-[11px] tracking-wide" style={{ color: '#6a5c4a' }}>
          {PAGE_TYPE_LABELS[template.page_type] ?? template.page_type}
        </p>

        <div className="flex flex-wrap gap-1 min-h-[28px]">
          {(template.renderer_config?.sections ?? [])
            .filter((s) => s !== 'footer')
            .slice(0, 5)
            .map((s) => (
              <SectionBadge key={s} section={s} />
            ))}
          {(template.renderer_config?.sections ?? []).filter((s) => s !== 'footer').length > 5 && (
            <span className="text-[10px]" style={{ color: '#4a3c2a' }}>
              +{(template.renderer_config?.sections ?? []).filter((s) => s !== 'footer').length - 5} more
            </span>
          )}
        </div>

        <div className="flex gap-2 mt-auto pt-1">
          <button
            onClick={() => onPreview(template)}
            className="flex-1 py-2 rounded-lg text-[10px] tracking-widest uppercase transition-all duration-200"
            style={{ border: '1px solid #2a2a2a', color: '#6a5c4a' }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = '#3a3a3a'
              el.style.color = '#a09080'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.borderColor = '#2a2a2a'
              el.style.color = '#6a5c4a'
            }}
          >
            Preview
          </button>
          <Link
            href={`/portal/order/new?template=${template.slug}`}
            className="flex-1 py-2 rounded-lg text-[10px] tracking-widest uppercase text-center font-medium transition-all duration-200"
            style={{ background: '#c9a96e', color: '#0a0a0a' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8c98a' }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#c9a96e' }}
          >
            Use This
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
