'use client'

import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import { Cormorant_Garamond, Playfair_Display, Cinzel, EB_Garamond } from 'next/font/google'
import { motion, useScroll, useSpring, useMotionValue } from 'framer-motion'
import type { PageData, TemplateConfig, SectionKey, SectionProps } from '../types'
import HeroSection from '../sections/HeroSection'
import StorySection from '../sections/StorySection'
import GallerySection from '../sections/GallerySection'
import MusicSection from '../sections/MusicSection'
import CountdownSection from '../sections/CountdownSection'
import RsvpSection from '../sections/RsvpSection'
import VideoSection from '../sections/VideoSection'
import GiftSection from '../sections/GiftSection'
import FooterSection from '../sections/FooterSection'
import CandleSection from '../sections/CandleSection'
import GuestBookSection from '../sections/GuestBookSection'
import MapSection from '../sections/MapSection'
import SlideshowSection from '../sections/SlideshowSection'
import { ShareModal } from '../../components/portal/ShareModal'

const cormorant = Cormorant_Garamond({
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
})

const playfair = Playfair_Display({
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const cinzel = Cinzel({
  weight: ['400', '600', '700'],
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
})

const ebGaramond = EB_Garamond({
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  display: 'swap',
})

type SectionComponent = React.ComponentType<SectionProps>

const SECTION_MAP: Partial<Record<SectionKey, SectionComponent>> = {
  hero: HeroSection,
  story: StorySection,
  gallery: GallerySection,
  slideshow: SlideshowSection,
  music: MusicSection,
  countdown: CountdownSection,
  rsvp: RsvpSection,
  video: VideoSection,
  gift: GiftSection,
  candle: CandleSection,
  guest_book: GuestBookSection,
  map: MapSection,
  footer: FooterSection,
}

const CELEBRATION_TEMPLATES = new Set([
  'cinematic-wedding', 'royal-wedding', 'garden-romance',
  'forever-and-always', 'milestone-birthday', 'glass-and-gold',
  'eternal-devotion',
])

interface TemplateRendererProps {
  page: PageData
  config: TemplateConfig
}

export default function TemplateRenderer({ page, config }: TemplateRendererProps) {
  const { theme, sections, animations, effects } = config
  const tier = config.tier
  const isLuxury = tier === 'luxury'
  const isPremiumOrLuxury = tier === 'premium' || tier === 'luxury'

  // Light mode overlay — reads global theme, applies subtle white wash on non-luxury pages
  const { resolvedTheme } = useTheme()
  const [overlayMounted, setOverlayMounted] = useState(false)
  useEffect(() => setOverlayMounted(true), [])
  const showLightOverlay = overlayMounted && !isLuxury && resolvedTheme === 'light'

  // Scroll progress bar
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Upgrade badge — fades out after 3 seconds
  const [showBadge, setShowBadge] = useState(isPremiumOrLuxury)
  useEffect(() => {
    if (!isPremiumOrLuxury) return
    const t = setTimeout(() => setShowBadge(false), 3000)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Gold cursor (luxury only — uses motion values to avoid re-renders)
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)
  const [cursorVisible, setCursorVisible] = useState(false)
  useEffect(() => {
    if (!isLuxury) return
    const onMove = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6)
      cursorY.set(e.clientY - 6)
      setCursorVisible(true)
    }
    const onLeave = () => setCursorVisible(false)
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [isLuxury, cursorX, cursorY])

  // Confetti — celebration templates only, premium + luxury
  const [showReplay, setShowReplay] = useState(false)
  useEffect(() => {
    if (!isPremiumOrLuxury) return
    if (!CELEBRATION_TEMPLATES.has(config.slug)) return
    const accent = theme.accent
    const cream = '#f5f0e8'
    const fire = async () => {
      const confetti = (await import('canvas-confetti')).default
      if (isLuxury) {
        confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: [accent, cream, '#ffffff'] })
        confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: [accent, cream, '#ffffff'] })
      } else {
        confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 }, colors: [accent, cream] })
      }
      setTimeout(() => setShowReplay(true), 3500)
      setTimeout(() => setShowReplay(false), 11500)
    }
    const t = setTimeout(fire, 1200)
    return () => clearTimeout(t)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function replayConfetti() {
    setShowReplay(false)
    const confetti = (await import('canvas-confetti')).default
    if (isLuxury) {
      confetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0, y: 0.65 }, colors: [theme.accent, '#f5f0e8', '#ffffff'] })
      confetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1, y: 0.65 }, colors: [theme.accent, '#f5f0e8', '#ffffff'] })
    } else {
      confetti({ particleCount: 120, spread: 70, origin: { y: 0.65 }, colors: [theme.accent, '#f5f0e8'] })
    }
    setTimeout(() => setShowReplay(true), 3500)
    setTimeout(() => setShowReplay(false), 11500)
  }

  // Share modal (luxury)
  const [showShare, setShowShare] = useState(false)

  const fontClasses = [
    cormorant.variable,
    playfair.variable,
    cinzel.variable,
    ebGaramond.variable,
  ].join(' ')

  return (
    <motion.div
      className={fontClasses}
      style={
        {
          background: theme.background,
          color: theme.text,
          fontFamily: theme.font,
          minHeight: '100dvh',
          paddingBottom: isPremiumOrLuxury ? 64 : 0,
          cursor: isLuxury ? 'none' : undefined,
          '--template-bg': theme.background,
          '--template-surface': theme.surface,
          '--template-primary': theme.primary,
          '--template-accent': theme.accent,
          '--template-text': theme.text,
          '--template-subtext': theme.subtext,
          '--template-divider': theme.divider,
          '--template-font': theme.font,
          '--template-heading-font': theme.headingFont,
          '--template-hero-gradient': theme.heroGradient,
        } as React.CSSProperties
      }
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isLuxury ? 1.5 : 0.6, ease: 'easeOut' }}
    >
      {/* Film grain — auto-applied for premium + luxury */}
      {(effects?.filmGrain || isPremiumOrLuxury) && (
        <div className="grain-overlay" aria-hidden="true" />
      )}

      {/* Light mode overlay — non-luxury only; softens template without breaking its design */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 1,
          background: 'rgba(255,255,255,0.08)',
          opacity: showLightOverlay ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Scroll progress bar — premium + luxury */}
      {isPremiumOrLuxury && (
        <motion.div
          className="fixed top-0 left-0 right-0 z-50 h-[2px] origin-left pointer-events-none"
          style={{ scaleX, background: theme.accent }}
        />
      )}

      {/* Upgrade badge — premium + luxury, fades out after 3s */}
      {isPremiumOrLuxury && (
        <motion.div
          className="fixed top-4 right-4 z-50 px-3 py-1.5 rounded-full pointer-events-none"
          style={{
            background: 'rgba(5,4,10,0.92)',
            border: `1px solid ${theme.accent}50`,
            backdropFilter: 'blur(8px)',
          }}
          animate={{ opacity: showBadge ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          <span
            className="text-[9px] tracking-[0.3em] uppercase font-medium"
            style={{ color: theme.accent }}
          >
            {tier}
          </span>
        </motion.div>
      )}

      {/* Confetti replay button */}
      {showReplay && (
        <motion.button
          className="fixed z-50 text-[10px] tracking-[0.2em] uppercase px-3 py-2 rounded-full pointer-events-auto"
          style={{
            bottom: isPremiumOrLuxury ? 80 : 20,
            left: 20,
            background: 'rgba(5,4,10,0.88)',
            border: `1px solid ${theme.accent}40`,
            color: theme.accent,
            fontFamily: theme.font,
            backdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          onClick={replayConfetti}
        >
          🎉 Again
        </motion.button>
      )}

      {/* Page sections */}
      {sections.map((sectionKey) => {
        const Section = SECTION_MAP[sectionKey]
        if (!Section) return null
        return (
          <Section
            key={sectionKey}
            page={page}
            theme={theme}
            animations={animations}
            effects={effects}
            tierName={tier}
          />
        )
      })}

      {/* Gold cursor dot — luxury only */}
      {isLuxury && (
        <motion.div
          className="fixed pointer-events-none rounded-full z-[9999]"
          style={{
            width: 12,
            height: 12,
            background: theme.accent,
            x: cursorX,
            y: cursorY,
            opacity: cursorVisible ? 0.85 : 0,
            boxShadow: `0 0 10px ${theme.accent}70`,
            transition: 'opacity 0.2s',
          }}
        />
      )}

      {/* Floating share button — luxury only */}
      {isLuxury && (
        <>
          <motion.button
            className="fixed z-50 w-12 h-12 rounded-full flex items-center justify-center"
            style={{
              bottom: 72,
              right: 20,
              background: theme.accent,
              color: theme.background,
              boxShadow: `0 4px 20px ${theme.accent}50`,
            }}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            onClick={() => setShowShare(true)}
            aria-label="Share this page"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
          </motion.button>
          {showShare && (
            <ShareModal
              slug={page.slug}
              title={page.title}
              onClose={() => setShowShare(false)}
            />
          )}
        </>
      )}
    </motion.div>
  )
}
