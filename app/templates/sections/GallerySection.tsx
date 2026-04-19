'use client'

import { useState, useEffect } from 'react'
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

// Basic lightbox — click to open, tap/click outside to close
function SimpleLightbox({ photo, onClose }: { photo: MediaFile; onClose: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: 'rgba(0,0,0,0.95)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.img
          src={photo.url}
          alt=""
          className="max-w-full max-h-full rounded"
          style={{ objectFit: 'contain', maxHeight: '90vh' }}
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
        />
        <button
          className="absolute top-6 right-6 text-white opacity-60 hover:opacity-100 transition-opacity text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
      </motion.div>
    </AnimatePresence>
  )
}

// Luxury lightbox — prev/next navigation + photo counter
function ImmersiveLightbox({
  photos,
  startIndex,
  onClose,
}: {
  photos: MediaFile[]
  startIndex: number
  onClose: () => void
}) {
  const [current, setCurrent] = useState(startIndex)

  const prev = () => setCurrent((i) => (i - 1 + photos.length) % photos.length)
  const next = () => setCurrent((i) => (i + 1) % photos.length)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center"
        style={{ background: 'rgba(0,0,0,0.97)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        {/* Counter */}
        <div
          className="absolute top-6 left-1/2 -translate-x-1/2 text-xs tracking-[0.25em]"
          style={{ color: 'rgba(245,230,200,0.5)' }}
        >
          {current + 1} / {photos.length}
        </div>

        {/* Close */}
        <button
          className="absolute top-6 right-6 text-white opacity-50 hover:opacity-100 transition-opacity text-2xl leading-none"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>

        {/* Prev */}
        <button
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(245,230,200,0.7)' }}
          onClick={(e) => { e.stopPropagation(); prev() }}
          aria-label="Previous"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* Next */}
        <button
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full transition-all"
          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(245,230,200,0.7)' }}
          onClick={(e) => { e.stopPropagation(); next() }}
          aria-label="Next"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={photos[current].url}
            alt=""
            className="max-w-full max-h-full"
            style={{ objectFit: 'contain', maxHeight: '85vh', maxWidth: 'calc(100vw - 120px)' }}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          />
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  )
}

function ShimmerCard({ theme, index }: { theme: SectionProps['theme']; index: number }) {
  return (
    <motion.div
      className="relative overflow-hidden"
      style={{
        aspectRatio: '1 / 1',
        background: theme.surface,
        border: `1px solid ${theme.divider}`,
      }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <motion.div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(105deg, transparent 40%, ${theme.accent}08 50%, transparent 60%)`,
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['-100% 0', '200% 0'] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: 'linear', delay: index * 0.15 }}
      />
    </motion.div>
  )
}

export default function GallerySection({ page, theme, animations, tierName }: SectionProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const variants = getMotionVariants(animations)
  const photos = page.media.filter((m) => m.type === 'photo')

  const isClickable = tierName !== 'basic'

  const headingContent = tierName === 'luxury'
    ? <ShimmerText theme={theme}>Memories</ShimmerText>
    : 'Memories'

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
          <span
            className="text-xs tracking-[0.25em] uppercase"
            style={{ color: tierName === 'luxury' ? 'unset' : theme.subtext, fontFamily: theme.font }}
          >
            {headingContent}
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        {photos.length === 0 ? (
          <>
            <div className={`grid gap-2 md:gap-3 ${tierName === 'basic' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
              {Array.from({ length: tierName === 'basic' ? 4 : 6 }).map((_, i) => (
                <ShimmerCard key={i} theme={theme} index={i} />
              ))}
            </div>
            <motion.p
              className="text-center mt-8 text-xs tracking-[0.2em] uppercase"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              Photos coming soon
            </motion.p>
          </>
        ) : tierName === 'premium' ? (
          // Premium — masonry columns
          <div className="columns-2 sm:columns-3 gap-2 md:gap-3">
            {photos.map((photo, i) => (
              <motion.div
                key={photo.id}
                className="break-inside-avoid mb-2 md:mb-3 relative overflow-hidden cursor-pointer group"
                variants={variants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.1 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedIndex(i)}
              >
                <img
                  src={photo.url}
                  alt=""
                  className="w-full block transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: 'rgba(0,0,0,0.2)' }}
                />
              </motion.div>
            ))}
          </div>
        ) : (
          // Basic (2-col) and Luxury (3-col with navigation lightbox)
          <div className={`grid gap-2 md:gap-3 ${tierName === 'basic' ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'}`}>
            {photos.map((photo, i) => {
              const isOrphan = tierName !== 'basic' && photos.length % 3 === 1 && i === photos.length - 1
              return (
                <motion.div
                  key={photo.id}
                  className={`relative overflow-hidden block w-full${isOrphan ? ' col-span-2 md:col-span-3' : ''}`}
                  style={{
                    aspectRatio: isOrphan ? '21 / 9' : '1 / 1',
                    cursor: isClickable ? 'pointer' : 'default',
                  }}
                  variants={variants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{ delay: i * 0.07 }}
                  onClick={isClickable ? () => setSelectedIndex(i) : undefined}
                  onMouseEnter={
                    tierName === 'basic'
                      ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 0 0 2px ${theme.accent}60` }
                      : undefined
                  }
                  onMouseLeave={
                    tierName === 'basic'
                      ? (e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none' }
                      : undefined
                  }
                  aria-label={isClickable ? 'View photo' : undefined}
                >
                  <img
                    src={photo.url}
                    alt=""
                    className={`w-full h-full object-cover ${isClickable ? 'transition-transform duration-700 hover:scale-105' : ''}`}
                  />
                  {isClickable && (
                    <div
                      className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300"
                      style={{ background: 'rgba(0,0,0,0.25)' }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedIndex !== null && tierName === 'luxury' && (
        <ImmersiveLightbox
          photos={photos}
          startIndex={selectedIndex}
          onClose={() => setSelectedIndex(null)}
        />
      )}
      {selectedIndex !== null && tierName === 'premium' && (
        <SimpleLightbox
          photo={photos[selectedIndex]}
          onClose={() => setSelectedIndex(null)}
        />
      )}
    </section>
  )
}
