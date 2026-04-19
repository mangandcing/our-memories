'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
  passed: boolean
}

function calcTimeLeft(targetDate: string): TimeLeft {
  const diff = new Date(targetDate).getTime() - Date.now()
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, passed: true }
  }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    passed: false,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

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

function FlipUnit({
  value,
  label,
  theme,
  animations,
  tierName,
}: {
  value: number
  label: string
  theme: SectionProps['theme']
  animations: SectionProps['animations']
  tierName: SectionProps['tierName']
}) {
  const padded = pad(value)
  const isPremiumOrLuxury = tierName === 'premium' || tierName === 'luxury'
  const isLuxury = tierName === 'luxury'

  return (
    <div
      className="flex flex-col items-center relative overflow-hidden"
      style={{
        padding: '1rem 0.5rem',
        border: isPremiumOrLuxury
          ? `1px solid ${theme.accent}40`
          : `1px solid ${theme.divider}`,
        borderRadius: 4,
        minWidth: 68,
        background: theme.background,
        boxShadow: isPremiumOrLuxury
          ? `0 0 16px ${theme.accent}18, inset 0 0 8px ${theme.accent}08`
          : 'none',
      }}
    >
      {/* Luxury pulsing glow */}
      {isLuxury && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${theme.accent}10 0%, transparent 70%)` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      {/* Dramatic ambient glow (non-luxury) */}
      {!isPremiumOrLuxury && animations === 'dramatic' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at center, ${theme.accent}08 0%, transparent 70%)` }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}

      <div className="relative h-[3rem] flex items-center justify-center overflow-hidden">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={padded}
            className="tabular-nums font-light leading-none"
            style={{
              fontFamily: theme.headingFont,
              color: theme.primary,
              fontSize: 'clamp(2rem, 5vw, 2.5rem)',
              display: 'block',
            }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
          >
            {padded}
          </motion.span>
        </AnimatePresence>
      </div>
      <span
        className="mt-2 text-[10px] tracking-widest uppercase"
        style={{ color: theme.subtext, fontFamily: theme.font }}
      >
        {label}
      </span>
    </div>
  )
}

export default function CountdownSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const targetDate = (
    (page.content.countdownDate as string | undefined) ||
    (page.content.date as string | undefined)
  )

  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null)

  useEffect(() => {
    if (!targetDate) return
    setTimeLeft(calcTimeLeft(targetDate))
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 1000)
    return () => clearInterval(id)
  }, [targetDate])

  if (!targetDate || !timeLeft) return null

  const formattedDate = new Date(targetDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const units = [
    { value: timeLeft.days, label: 'Days' },
    { value: timeLeft.hours, label: 'Hours' },
    { value: timeLeft.minutes, label: 'Mins' },
    { value: timeLeft.seconds, label: 'Secs' },
  ]

  const headingContent = tierName === 'luxury'
    ? <ShimmerText theme={theme}>Counting Down</ShimmerText>
    : 'Counting Down'

  return (
    <section className="py-24 px-6" style={{ background: theme.surface }}>
      <div className="max-w-lg mx-auto text-center">
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

        <motion.p
          className="text-sm tracking-widest mb-12"
          style={{ color: theme.subtext, fontFamily: theme.font }}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {formattedDate}
        </motion.p>

        {timeLeft.passed ? (
          <motion.p
            className="text-2xl font-light tracking-widest"
            style={{ color: theme.accent, fontFamily: theme.headingFont }}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            The day has come
          </motion.p>
        ) : (
          <motion.div
            className="flex items-center justify-center gap-2"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {units.map(({ value, label }) => (
              <FlipUnit
                key={label}
                value={value}
                label={label}
                theme={theme}
                animations={animations}
                tierName={tierName}
              />
            ))}
          </motion.div>
        )}
      </div>
    </section>
  )
}
