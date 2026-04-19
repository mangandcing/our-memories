'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import SectionBadge from './SectionBadge'
import type { TemplateWithTier } from './TemplateCard'
import { PAGE_TYPE_LABELS } from './TemplateCard'

const TIER_FEATURES: Record<string, string[]> = {
  Basic: ['Text content', 'Gift section', '10 templates', 'Shareable link', 'QR code'],
  Premium: ['Everything in Basic', 'Photo gallery', 'Background music', 'Countdown timer', 'RSVP form', 'Guest book', 'PDF export'],
  Luxury: ['Everything in Premium', 'Video embed', 'Slideshow', 'Interactive games', 'Collaboration mode', 'Custom domain'],
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
}

function AnimatedMockup({ template }: { template: TemplateWithTier }) {
  const gradient = template.renderer_config?.theme?.heroGradient
    ?? 'radial-gradient(ellipse at 50% 40%, #1a1208 0%, #0d0a04 40%, #0a0a0a 100%)'
  const accent = template.renderer_config?.theme?.accent ?? '#c9a96e'
  const primary = template.renderer_config?.theme?.primary ?? '#f5e6c8'

  return (
    <div className="relative mx-auto" style={{ width: 200, height: 360 }}>
      {/* Phone frame */}
      <div
        className="absolute inset-0 rounded-[2rem] overflow-hidden"
        style={{
          background: gradient,
          border: `1px solid ${accent}30`,
          boxShadow: `0 0 60px ${accent}18, inset 0 0 40px rgba(0,0,0,0.4)`,
        }}
      >
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-14 h-1.5 rounded-full" style={{ background: 'rgba(0,0,0,0.5)' }} />

        {/* Content */}
        <motion.div
          className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 pt-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="w-8 h-px"
            style={{ background: `${accent}90` }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-center space-y-1.5"
          >
            <div className="text-[9px] tracking-[0.3em] uppercase" style={{ color: `${accent}80` }}>
              {PAGE_TYPE_LABELS[template.page_type] ?? ''}
            </div>
            <div className="text-[13px] font-light tracking-wide" style={{ color: primary }}>
              {template.name}
            </div>
          </motion.div>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.4 }}
            className="w-8 h-px"
            style={{ background: `${accent}90` }}
          />

          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="w-full space-y-1.5 mt-2"
          >
            <div className="h-1.5 rounded-full" style={{ background: `${accent}30` }} />
            <div className="h-1.5 w-4/5 rounded-full" style={{ background: `${accent}20` }} />
            <div className="h-1.5 w-3/5 rounded-full" style={{ background: `${accent}15` }} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75, duration: 0.4 }}
            className="w-full grid grid-cols-3 gap-1 mt-1"
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-lg"
                style={{ background: `${accent}${i === 0 ? '25' : i === 1 ? '18' : '12'}` }}
              />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="px-5 py-1.5 rounded-full text-[9px] tracking-widest uppercase"
            style={{ background: accent, color: '#0a0a0a' }}
          >
            Open
          </motion.div>
        </motion.div>
      </div>

      {/* Glow */}
      <div
        className="absolute -inset-4 rounded-[3rem] -z-10 blur-2xl opacity-20"
        style={{ background: accent }}
      />
    </div>
  )
}

type Props = {
  template: TemplateWithTier | null
  onClose: () => void
}

export default function TemplatePreviewModal({ template, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  useEffect(() => {
    if (template) document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [template])

  const tierName = template?.tiers?.name ?? 'Basic'
  const features = TIER_FEATURES[tierName] ?? []
  const sections = (template?.renderer_config?.sections ?? []).filter((s) => s !== 'footer')
  const accent = template?.renderer_config?.theme?.accent ?? '#c9a96e'

  return (
    <AnimatePresence>
      {template && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.88)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
          <motion.div
            className="relative w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]"
            style={{ background: '#0f0f0f', border: '1px solid #1e1e1e' }}
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 16 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: '#1a1a1a' }}>
              <div>
                <p className="text-[10px] tracking-[0.3em] uppercase mb-0.5" style={{ color: `${accent}80` }}>
                  Template Preview
                </p>
                <h2 className="text-base font-light" style={{ color: '#f5e6c8' }}>{template.name}</h2>
              </div>
              <button
                onClick={onClose}
                className="flex items-center justify-center w-8 h-8 rounded-full transition-colors"
                style={{ color: '#5a4a3a' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#f5e6c8' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#5a4a3a' }}
                aria-label="Close"
              >
                <IconX />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="flex flex-col md:flex-row gap-8 p-6">
                {/* Mockup */}
                <div className="flex items-center justify-center md:w-48 shrink-0 py-4">
                  <AnimatedMockup template={template} />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-6">
                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-1" style={{ color: '#5a4a3a' }}>
                      Page Type
                    </p>
                    <p className="text-sm font-light" style={{ color: '#c8b89a' }}>
                      {PAGE_TYPE_LABELS[template.page_type] ?? template.page_type}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: '#5a4a3a' }}>
                      This template includes
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {sections.map((s) => (
                        <SectionBadge key={s} section={s} />
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] tracking-widest uppercase mb-3" style={{ color: '#5a4a3a' }}>
                      {tierName} plan features
                    </p>
                    <ul className="space-y-2">
                      {features.map((f) => (
                        <li key={f} className="flex items-center gap-2 text-xs" style={{ color: '#8a7a68' }}>
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer CTA */}
            <div className="px-6 py-4 border-t" style={{ borderColor: '#1a1a1a' }}>
              <Link
                href={`/portal/order/new?template=${template.slug}`}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium tracking-widest uppercase transition-all duration-200"
                style={{ background: '#c9a96e', color: '#0a0a0a' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#e8c98a' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.background = '#c9a96e' }}
              >
                Use This Template
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
