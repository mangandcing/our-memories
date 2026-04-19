'use client'

import { useState } from 'react'
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

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

const socials = [
  { label: 'Facebook', href: 'https://facebook.com/ourmemories', icon: FacebookIcon },
  { label: 'Instagram', href: 'https://instagram.com/ourmemories', icon: InstagramIcon },
  { label: 'TikTok', href: 'https://tiktok.com/@ourmemories', icon: TikTokIcon },
  { label: 'Telegram', href: 'https://t.me/ourmemories', icon: TelegramIcon },
]

export default function FooterSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null)
  const isLuxury = tierName === 'luxury'
  const isPremiumOrLuxury = tierName === 'premium' || tierName === 'luxury'

  const brandName = isLuxury
    ? <ShimmerText theme={theme}>our-memories.store</ShimmerText>
    : 'our-memories.store'

  return (
    <motion.footer
      className="py-20 px-6 relative"
      style={{ background: theme.background }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      {/* Top divider — animated for premium/luxury, static for basic */}
      {isPremiumOrLuxury ? (
        <motion.div
          className="absolute top-0 left-0 right-0"
          style={{ height: 1, background: theme.accent, originX: 0 }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
      ) : (
        <div
          className="absolute top-0 left-0 right-0"
          style={{ height: 1, background: `${theme.accent}30` }}
        />
      )}

      <div className="max-w-sm mx-auto text-center">
        <motion.div
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-1"
            style={{ color: theme.subtext, fontFamily: theme.font }}
          >
            created with
          </p>
          <a
            href="https://our-memories.store"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-[0.2em] transition-opacity hover:opacity-70"
            style={{
              color: isLuxury ? 'unset' : theme.accent,
              fontFamily: theme.headingFont,
              fontStyle: 'italic',
            }}
          >
            {brandName}
          </a>
          <p
            className="mt-2 text-xs"
            style={{ color: theme.subtext, fontFamily: theme.font }}
          >
            Celebrate every moment
          </p>
        </motion.div>

        <motion.div
          className="flex items-center justify-center gap-6 mt-10"
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.15 }}
        >
          {socials.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="w-11 h-11 flex items-center justify-center transition-all duration-300"
              style={{
                color: hoveredSocial === label ? theme.accent : theme.subtext,
                filter: hoveredSocial === label ? `drop-shadow(0 0 6px ${theme.accent}80)` : 'none',
              }}
              onMouseEnter={() => setHoveredSocial(label)}
              onMouseLeave={() => setHoveredSocial(null)}
            >
              <Icon />
            </a>
          ))}
        </motion.div>

        {page.is_published && (
          <motion.div
            className="flex flex-col items-center gap-2 mt-10"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.25 }}
          >
            <div
              className="rounded-lg p-2"
              style={{ background: '#0a0a0a', border: `1px solid ${theme.divider}` }}
            >
              <img
                src={`/api/qr?slug=${encodeURIComponent(page.slug)}`}
                alt="QR code"
                width={80}
                height={80}
                style={{ imageRendering: 'pixelated', display: 'block' }}
              />
            </div>
            <p
              className="text-[10px] tracking-[0.2em] uppercase"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              Scan to share this page
            </p>
          </motion.div>
        )}

        <motion.div
          style={{ width: 32, height: 1, background: theme.divider, margin: '2.5rem auto 0' }}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        />

        <motion.p
          className="mt-4 text-xs"
          style={{ color: theme.subtext, fontFamily: theme.font, opacity: 0.5 }}
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          &copy; {new Date().getFullYear()} Our Memories
        </motion.p>
      </div>
    </motion.footer>
  )
}
