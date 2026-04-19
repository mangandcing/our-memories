'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'

export default function MapSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const venueName = page.content.venueName as string | undefined
  const venueAddress = page.content.venueAddress as string | undefined
  const [copied, setCopied] = useState(false)

  if (!venueName && !venueAddress) return null

  const venueQuery = [venueName, venueAddress].filter(Boolean).join(', ')
  const displayName = venueName || venueAddress!

  const mapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueQuery)}&output=embed`
  const directionsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(venueQuery)}`
  const isPremiumOrLuxury = tierName === 'premium' || tierName === 'luxury'
  const isLuxury = tierName === 'luxury'

  function copyAddress() {
    navigator.clipboard.writeText(venueQuery).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="py-24 px-6" style={{ background: theme.surface }}>
      <div className="max-w-2xl mx-auto">
        <motion.div
          className="flex items-center gap-4 mb-14"
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: theme.subtext, fontFamily: theme.font }}
          >
            Location
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        <motion.div
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="flex flex-col gap-6"
        >
          <motion.p
            className="text-center text-base tracking-wide"
            style={{ color: theme.primary, fontFamily: theme.headingFont, fontStyle: 'italic' }}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {displayName}
            {venueName && venueAddress && (
              <span className="block text-sm mt-1" style={{ color: theme.subtext, fontStyle: 'normal', fontFamily: theme.font }}>
                {venueAddress}
              </span>
            )}
          </motion.p>

          <div
            className="overflow-hidden"
            style={{
              borderRadius: 4,
              border: isLuxury ? `1px solid ${theme.accent}40` : `1px solid ${theme.divider}`,
              boxShadow: isLuxury ? `0 0 24px ${theme.accent}14` : 'none',
            }}
          >
            <iframe
              src={mapsUrl}
              width="100%"
              height="320"
              style={{ display: 'block', border: 0, filter: 'grayscale(20%) contrast(1.05)' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Venue map"
            />
          </div>

          {isPremiumOrLuxury && (
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <a
                href={directionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
                style={{ color: theme.accent, fontFamily: theme.font }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="3 11 22 2 13 21 11 13 3 11" />
                </svg>
                Get Directions
              </a>

              {isLuxury && (
                <button
                  onClick={copyAddress}
                  className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase transition-all"
                  style={{ color: copied ? theme.accent : theme.subtext, fontFamily: theme.font }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {copied ? (
                      <polyline points="20 6 9 17 4 12" />
                    ) : (
                      <>
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </>
                    )}
                  </svg>
                  {copied ? 'Copied!' : 'Copy Address'}
                </button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
