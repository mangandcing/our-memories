'use client'

import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
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

function Diamond({ color }: { color: string }) {
  return (
    <div className="flex items-center justify-center my-10">
      <div style={{ width: 40, height: 1, background: `${color}30` }} />
      <div
        style={{
          width: 5,
          height: 5,
          background: color,
          opacity: 0.4,
          transform: 'rotate(45deg)',
          margin: '0 10px',
          flexShrink: 0,
        }}
      />
      <div style={{ width: 40, height: 1, background: `${color}30` }} />
    </div>
  )
}

export default function StorySection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const { story, brideName, groomName } = page.content

  const hasCoupleNames = brideName || groomName
  const paragraphs = story ? (story as string).split('\n\n').filter(Boolean) : []

  const headingContent = tierName === 'luxury'
    ? <ShimmerText theme={theme}>Our Story</ShimmerText>
    : 'Our Story'

  const SectionHeading = (
    <motion.div
      className="flex items-center gap-4 mb-14"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
    >
      <div style={{ flex: 1, height: 1, background: theme.divider }} />
      <motion.span
        className="text-xs tracking-[0.25em] uppercase"
        style={{ color: tierName === 'luxury' ? 'unset' : theme.subtext, fontFamily: theme.font }}
        whileInView={tierName !== 'luxury' ? { letterSpacing: '0.35em' } : undefined}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        {headingContent}
      </motion.span>
      <div style={{ flex: 1, height: 1, background: theme.divider }} />
    </motion.div>
  )

  const CoupleNames = hasCoupleNames ? (
    <motion.div
      className="text-center mb-12"
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      <p
        className="text-3xl md:text-4xl font-light"
        style={{ fontFamily: theme.headingFont, color: theme.primary, lineHeight: 1.3 }}
      >
        {brideName as string}
        {brideName && groomName && (
          <span style={{ color: theme.accent, margin: '0 0.5em' }}>&amp;</span>
        )}
        {groomName as string}
      </p>
    </motion.div>
  ) : null

  // ── LUXURY — word-by-word reveal ─────────────────────────────────────────────
  if (tierName === 'luxury') {
    return (
      <section className="py-24 px-6" style={{ background: theme.surface }}>
        <div className="mx-auto" style={{ maxWidth: '42rem' }}>
          {SectionHeading}
          {CoupleNames}
          {paragraphs.length > 0 ? (
            paragraphs.map((para, pi) => {
              const words = para.split(' ')
              return (
                <motion.p
                  key={pi}
                  className="mb-8 last:mb-0"
                  style={{
                    fontFamily: theme.font,
                    lineHeight: 2.1,
                    fontSize: '1.05rem',
                  }}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.1 }}
                  variants={{
                    hidden: {},
                    visible: { transition: { staggerChildren: 0.025 } },
                  }}
                >
                  {words.map((word, wi) => (
                    <motion.span
                      key={wi}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: {
                          opacity: 0.88,
                          y: 0,
                          transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                        },
                      }}
                      style={{
                        display: 'inline-block',
                        marginRight: '0.28em',
                        color: theme.text,
                      }}
                    >
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              )
            })
          ) : (
            <p className="text-center text-sm" style={{ color: theme.subtext, fontFamily: theme.font }}>
              No story has been written yet.
            </p>
          )}
        </div>
      </section>
    )
  }

  // ── PREMIUM — 2-column editorial with drop cap ────────────────────────────────
  if (animations === 'cinematic') {
    return (
      <section className="py-24 px-6" style={{ background: theme.surface }}>
        <div className="mx-auto" style={{ maxWidth: '72rem' }}>
          {SectionHeading}
          {CoupleNames}
          <div className="md:grid md:grid-cols-2 md:gap-16">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, i) => (
                <motion.p
                  key={i}
                  className={`text-base md:text-lg leading-[1.9] mb-6 last:mb-0 ${i === 0 ? 'first-letter:text-5xl first-letter:font-normal first-letter:float-left first-letter:mr-2 first-letter:leading-none' : ''}`}
                  style={{
                    fontFamily: theme.font,
                    color: theme.text,
                    opacity: 0.85,
                  }}
                  variants={variants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.1 }}
                >
                  {paragraph}
                </motion.p>
              ))
            ) : (
              <p
                className="col-span-2 text-center text-sm"
                style={{ color: theme.subtext, fontFamily: theme.font }}
              >
                No story has been written yet.
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  // ── DRAMATIC (non-luxury) — left border with diamond separators ───────────────
  if (animations === 'dramatic') {
    return (
      <section className="py-24 px-6" style={{ background: theme.surface }}>
        <div className="mx-auto" style={{ maxWidth: '42rem' }}>
          {SectionHeading}
          {CoupleNames}
          <div className="relative">
            <motion.div
              className="absolute left-0 top-0 bottom-0 w-px hidden md:block"
              style={{ background: `linear-gradient(to bottom, transparent, ${theme.accent}40, transparent)`, originY: 0 }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            />
            <div className="md:pl-10">
              {paragraphs.length > 0 ? (
                paragraphs.map((paragraph, i) => (
                  <div key={i}>
                    <motion.p
                      className="text-base md:text-lg leading-[2] mb-0"
                      style={{
                        fontFamily: theme.font,
                        color: theme.text,
                        opacity: 0.85,
                      }}
                      variants={variants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ delay: i * 0.12 }}
                    >
                      {paragraph}
                    </motion.p>
                    {i < paragraphs.length - 1 && <Diamond color={theme.accent} />}
                  </div>
                ))
              ) : (
                <p
                  className="text-center text-sm"
                  style={{ color: theme.subtext, fontFamily: theme.font }}
                >
                  No story has been written yet.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    )
  }

  // ── BASIC (minimal) — centered, generous line height ─────────────────────────
  return (
    <section className="py-24 px-6" style={{ background: theme.surface }}>
      <div className="mx-auto" style={{ maxWidth: '42rem' }}>
        {SectionHeading}
        {CoupleNames}
        {paragraphs.length > 0 ? (
          paragraphs.map((paragraph, i) => (
            <motion.p
              key={i}
              className="text-base md:text-lg mb-7 last:mb-0 text-center"
              style={{
                fontFamily: theme.font,
                color: theme.text,
                opacity: 0.85,
                lineHeight: 1.95,
              }}
              variants={variants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.08 }}
            >
              {paragraph}
            </motion.p>
          ))
        ) : (
          <p
            className="text-center text-sm"
            style={{ color: theme.subtext, fontFamily: theme.font }}
          >
            No story has been written yet.
          </p>
        )}
      </div>
    </section>
  )
}
