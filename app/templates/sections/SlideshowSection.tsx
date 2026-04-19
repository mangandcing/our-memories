'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionProps, MediaFile } from '../types'
import { getMotionVariants } from '../types'

function ShimmerText({ children, theme }: { children: React.ReactNode; theme: SectionProps['theme'] }) {
  return (
    <motion.span
      style={{
        background: `linear-gradient(90deg, ${theme.accent} 0%, #f5f0e8 45%, ${theme.accent} 90%)`,
        backgroundSize: '200% auto',
        WebkitBackgroundClip: 'text',
        backgroundClip: 'text',
        color: 'transparent',
        display: 'inline-block',
      }}
      animate={{ backgroundPosition: ['0% center', '200% center'] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
    >
      {children}
    </motion.span>
  )
}

function ShimmerCard({ theme, index }: { theme: SectionProps['theme']; index: number }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        aspectRatio: '16 / 9',
        background: theme.surface,
        border: `1px solid ${theme.divider}`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${theme.accent}08 50%, transparent 60%)`,
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: index * 0.2 }}
      />
    </motion.div>
  )
}

const KEN_BURNS_VARIANTS = [
  { initial: { scale: 1.08, x: -16, y: -8 }, animate: { scale: 1.0, x: 0, y: 0 } },
  { initial: { scale: 1.0, x: 0, y: 0 }, animate: { scale: 1.08, x: 16, y: 8 } },
  { initial: { scale: 1.06, x: 12, y: -6 }, animate: { scale: 1.0, x: -8, y: 6 } },
  { initial: { scale: 1.0, x: -8, y: 8 }, animate: { scale: 1.07, x: 8, y: -4 } },
]

export default function SlideshowSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const photos = page.media.filter((m) => m.type === 'photo')
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (photos.length <= 1 || paused) return
    intervalRef.current = setInterval(() => {
      setCurrent((i) => (i + 1) % photos.length)
    }, 5000)
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [photos.length, paused]) // eslint-disable-line react-hooks/exhaustive-deps

  function goTo(index: number) {
    setCurrent(index)
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (!paused) {
      intervalRef.current = setInterval(() => {
        setCurrent((i) => (i + 1) % photos.length)
      }, 5000)
    }
  }

  function handlePanEnd(_: unknown, info: { offset: { x: number } }) {
    if (Math.abs(info.offset.x) < 50) return
    if (info.offset.x < 0) {
      goTo((current + 1) % photos.length)
    } else {
      goTo((current - 1 + photos.length) % photos.length)
    }
  }

  const headingContent = <ShimmerText theme={theme}>Memories</ShimmerText>
  const kbVariant = KEN_BURNS_VARIANTS[current % KEN_BURNS_VARIANTS.length]

  if (photos.length === 0) {
    return (
      <section className="py-24 px-6" style={{ background: theme.background }}>
        <div className="max-w-4xl mx-auto">
          <motion.div
            className="flex items-center gap-4 mb-14"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.4 }}
          >
            <div style={{ flex: 1, height: 1, background: theme.divider }} />
            <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: theme.font }}>
              {headingContent}
            </span>
            <div style={{ flex: 1, height: 1, background: theme.divider }} />
          </motion.div>
          <ShimmerCard theme={theme} index={0} />
          <motion.p
            className="text-center mt-6 text-xs tracking-[0.2em] uppercase"
            style={{ color: theme.subtext, fontFamily: theme.font }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Photos coming soon
          </motion.p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-24 px-6" style={{ background: theme.background }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="flex items-center gap-4 mb-14"
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
          <span className="text-xs tracking-[0.25em] uppercase" style={{ fontFamily: theme.font }}>
            {headingContent}
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        <motion.div
          className="relative overflow-hidden"
          style={{
            aspectRatio: '16 / 9',
            border: `1px solid ${theme.accent}30`,
            boxShadow: `0 0 40px ${theme.accent}10`,
          }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onPanEnd={handlePanEnd}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.05}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={current}
              src={photos[current].url}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0, ...kbVariant.initial }}
              animate={{ opacity: 1, ...kbVariant.animate }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.8, ease: 'easeInOut' },
                scale: { duration: 5.5, ease: 'linear' },
                x: { duration: 5.5, ease: 'linear' },
                y: { duration: 5.5, ease: 'linear' },
              }}
              draggable={false}
            />
          </AnimatePresence>

          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.5) 100%)' }}
          />

          {photos.length > 1 && (
            <>
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all pointer-events-auto"
                style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
                onClick={() => goTo((current - 1 + photos.length) % photos.length)}
                aria-label="Previous photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-full transition-all pointer-events-auto"
                style={{ background: 'rgba(0,0,0,0.35)', color: 'rgba(255,255,255,0.7)' }}
                onClick={() => goTo((current + 1) % photos.length)}
                aria-label="Next photo"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </>
          )}
        </motion.div>

        {photos.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {photos.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to photo ${i + 1}`}
                style={{
                  width: i === current ? 20 : 6,
                  height: 6,
                  borderRadius: 3,
                  background: i === current ? theme.accent : `${theme.accent}35`,
                  transition: 'all 0.3s ease',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
