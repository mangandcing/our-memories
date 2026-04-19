'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import type { SectionProps } from '../types'

const PARTICLES = [
  { x: '8%',  startY: '85%', size: 2,   duration: 9,  delay: 0 },
  { x: '22%', startY: '90%', size: 1.5, duration: 12, delay: 2.5 },
  { x: '37%', startY: '75%', size: 2.5, duration: 10, delay: 1 },
  { x: '52%', startY: '88%', size: 1.5, duration: 8,  delay: 4 },
  { x: '64%', startY: '80%', size: 2,   duration: 11, delay: 0.8 },
  { x: '78%', startY: '92%', size: 3,   duration: 9,  delay: 3 },
  { x: '91%', startY: '78%', size: 2,   duration: 13, delay: 1.5 },
]

export default function HeroSection({ page, theme, animations, effects, tierName }: SectionProps) {
  const containerRef = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })
  const yBg = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])

  const heroPhoto =
    page.media.find((m) => m.sort_order === 0 && m.type === 'photo') ??
    page.media.find((m) => m.type === 'photo')
  const hasPhoto = Boolean(heroPhoto)

  const name1 = ((page.content.name1 as string | undefined) ?? '').trim()
  const name2 = ((page.content.name2 as string | undefined) ?? '').trim()
  const subtitle = (
    (page.content.subtitle as string | undefined) ??
    (page.content.heroSubtitle as string | undefined) ??
    ''
  ).trim()

  const hasNames = Boolean(name1)
  const nameHeading = hasNames ? (name2 ? `${name1} & ${name2}` : name1) : null
  const eyebrow = hasNames ? page.template.name : null
  const displayTitle = nameHeading ?? page.title

  // ── BASIC (minimal) ──────────────────────────────────────────────────────────
  if (animations === 'minimal') {
    return (
      <section
        ref={containerRef}
        className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden"
      >
        {hasPhoto ? (
          <>
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url(${heroPhoto!.url})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.55)' }} />
          </>
        ) : (
          <div className="absolute inset-0" style={{ background: theme.heroGradient }} />
        )}

        <motion.div
          className="relative z-10 text-center max-w-sm mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        >
          {eyebrow && (
            <motion.p
              className="mb-7 text-[10px] tracking-[0.3em] uppercase"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.div
            className="mx-auto mb-9"
            style={{ width: 44, height: 1, background: theme.accent, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.h1
            className="font-light tracking-[0.18em] uppercase leading-tight"
            style={{
              fontFamily: theme.headingFont,
              color: theme.primary,
              fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.25 }}
          >
            {displayTitle}
          </motion.h1>
          {subtitle && (
            <motion.p
              className="mt-5 text-xs tracking-[0.22em]"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.55 }}
            >
              {subtitle}
            </motion.p>
          )}
          <motion.div
            className="mx-auto mt-9"
            style={{ width: 44, height: 1, background: theme.accent, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
        </motion.div>
      </section>
    )
  }

  // ── PREMIUM (cinematic) ───────────────────────────────────────────────────────
  if (animations === 'cinematic') {
    return (
      <section
        ref={containerRef}
        className="relative overflow-hidden"
        style={{ height: '100svh' }}
      >
        {hasPhoto ? (
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroPhoto!.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
            initial={{ scale: 1.0 }}
            animate={{ scale: 1.08 }}
            transition={{ duration: 20, ease: 'linear' }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: theme.heroGradient }} />
        )}

        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(5,5,5,0.35) 0%, rgba(5,5,5,0.1) 35%, rgba(5,5,5,0.85) 100%)',
          }}
        />

        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ opacity: 0.07, mixBlendMode: 'overlay' }}
        >
          <filter id="film-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#film-grain)" />
        </svg>

        <motion.div
          className="absolute top-0 left-0 right-0 bg-black"
          style={{ height: 80 }}
          initial={{ y: '-100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-black"
          style={{ height: 80 }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        />

        <div
          className="absolute inset-0 flex flex-col items-center justify-center px-6"
          style={{ paddingTop: 80, paddingBottom: 80 }}
        >
          {eyebrow && (
            <motion.p
              className="mb-6 text-[10px] tracking-[0.35em] uppercase text-center"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.1 }}
            >
              {eyebrow}
            </motion.p>
          )}
          <motion.div
            style={{ width: 72, height: 1, background: theme.accent, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.h1
            className="text-center mt-7 mb-7 font-normal"
            style={{
              fontFamily: theme.headingFont,
              color: theme.primary,
              fontSize: 'clamp(2.2rem, 7vw, 5rem)',
              letterSpacing: '0.12em',
              lineHeight: 1.2,
            }}
            initial={{ opacity: 0, x: -32 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
          >
            {displayTitle}
          </motion.h1>
          <motion.div
            style={{ width: 72, height: 1, background: theme.accent, originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          />
          {subtitle && (
            <motion.p
              className="mt-7 text-xs tracking-[0.3em] uppercase text-center"
              style={{ color: theme.accent, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1 }}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </section>
    )
  }

  // ── LUXURY (dramatic) — parallax + particles + letter-by-letter name ─────────
  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '100svh' }}
    >
      <motion.div className="absolute inset-0 scale-110" style={{ y: yBg }}>
        {hasPhoto ? (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${heroPhoto!.url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        ) : (
          <div className="absolute inset-0" style={{ background: theme.heroGradient }} />
        )}
      </motion.div>

      {effects?.particles && (
        <div className="absolute inset-0 particle-shimmer pointer-events-none" />
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {PARTICLES.map((p, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.x,
              top: p.startY,
              width: p.size,
              height: p.size,
              background: theme.accent,
            }}
            animate={{
              y: [0, -120, -220],
              opacity: [0, 0.13, 0.13, 0],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              repeatDelay: p.delay * 0.5,
              times: [0, 0.4, 0.8, 1],
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.8) 100%)',
        }}
      />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6">
        {eyebrow && (
          <motion.p
            className="mb-8 text-[10px] tracking-[0.35em] uppercase text-center"
            style={{ color: theme.subtext, fontFamily: theme.font }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
          >
            {eyebrow}
          </motion.p>
        )}
        <motion.div
          className="mx-auto mb-10"
          style={{ width: 1, height: 56, background: theme.accent }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={{ scaleY: 1, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {/* Letter-by-letter title reveal for luxury */}
        {tierName === 'luxury' ? (
          <h1
            className="text-center uppercase font-normal flex flex-wrap justify-center"
            style={{
              fontFamily: theme.headingFont,
              color: theme.primary,
              fontSize: 'clamp(2.8rem, 8vw, 6rem)',
              letterSpacing: '0.2em',
              lineHeight: 1.35,
            }}
          >
            {displayTitle.split('').map((char, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.8,
                  delay: 0.5 + i * 0.04,
                  ease: [0.16, 1, 0.3, 1],
                }}
                style={{ display: 'inline-block', whiteSpace: 'pre' }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </h1>
        ) : (
          <motion.h1
            className="text-center uppercase font-normal"
            style={{
              fontFamily: theme.headingFont,
              color: theme.primary,
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              letterSpacing: '0.2em',
              lineHeight: 1.35,
            }}
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
          >
            {displayTitle}
          </motion.h1>
        )}

        {subtitle && (
          <motion.p
            className="mt-6 text-xs tracking-[0.3em] uppercase text-center"
            style={{ color: theme.accent, fontFamily: theme.font }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: tierName === 'luxury' ? 1.8 : 1.2 }}
          >
            {subtitle}
          </motion.p>
        )}
        <motion.div
          className="flex items-center gap-5 mt-10"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: tierName === 'luxury' ? 2 : 1 }}
        >
          <div style={{ width: 36, height: 1, background: `${theme.accent}80` }} />
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: theme.accent,
              boxShadow: `0 0 8px ${theme.accent}60`,
            }}
          />
          <div style={{ width: 36, height: 1, background: `${theme.accent}80` }} />
        </motion.div>
      </div>
    </section>
  )
}
