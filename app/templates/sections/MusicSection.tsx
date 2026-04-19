'use client'

import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'

function PlayIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}

function PauseIcon({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
    </svg>
  )
}

function VisualizerBars({ theme }: { theme: SectionProps['theme'] }) {
  const bars = [
    { minH: 4,  maxH: 20, delay: 0 },
    { minH: 8,  maxH: 24, delay: 0.12 },
    { minH: 14, maxH: 28, delay: 0.24 },
    { minH: 8,  maxH: 22, delay: 0.1 },
    { minH: 4,  maxH: 18, delay: 0.3 },
  ]
  return (
    <div className="flex items-end gap-[3px]" style={{ height: 28 }}>
      {bars.map((b, i) => (
        <motion.div
          key={i}
          style={{ width: 3, background: theme.accent, borderRadius: 2 }}
          animate={{ height: [b.minH, b.maxH, b.minH] }}
          transition={{ duration: 0.7, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
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

function formatDuration(seconds: number): string {
  if (!seconds || !isFinite(seconds)) return ''
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function MusicSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [showBanner, setShowBanner] = useState(false)

  const track = page.media.find((m) => m.type === 'audio')

  useEffect(() => {
    if (!track) return
    const audio = audioRef.current
    if (!audio) return
    audio.muted = true
    audio.play()
      .then(() => {
        setPlaying(true)
        setTimeout(() => { audio.muted = false }, 1000)
      })
      .catch(() => {
        if (tierName === 'basic') setShowBanner(true)
      })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (!track) return null

  const encodedUrl = track.url.split('/').map((seg, i, arr) => i === arr.length - 1 ? encodeURIComponent(seg) : seg).join('/')

  const rawName = track.file_name ? track.file_name.replace(/\.[^.]+$/, '').trim() : ''
  const trackName = rawName && /[a-zA-Z]{2,}/.test(rawName) && !/^[a-z]{1,4}[\s_-]?\d+$/i.test(rawName)
    ? rawName
    : 'Our Song'

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause() } else { audio.play() }
    setPlaying(!playing)
  }

  function onTimeUpdate() {
    const audio = audioRef.current
    if (!audio || !audio.duration) return
    setProgress((audio.currentTime / audio.duration) * 100)
  }

  function onLoadedMetadata() {
    const audio = audioRef.current
    if (!audio) return
    setDuration(audio.duration)
  }

  function onEnded() {
    setPlaying(false)
    setProgress(0)
  }

  function seek(e: React.MouseEvent<HTMLDivElement>) {
    const audio = audioRef.current
    if (!audio) return
    const rect = e.currentTarget.getBoundingClientRect()
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration
  }

  function handleBannerPlay() {
    const audio = audioRef.current
    if (!audio) return
    audio.play().then(() => { setPlaying(true); setShowBanner(false) }).catch(() => {})
  }

  // ── PREMIUM + LUXURY — floating fixed bar ────────────────────────────────────
  if (tierName !== 'basic') {
    return (
      <>
        <audio
          ref={audioRef}
          src={encodedUrl}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
          onEnded={onEnded}
          preload="metadata"
        />
        <div
          className="fixed bottom-0 left-0 right-0 z-40"
          style={{
            background: 'rgba(5,4,10,0.96)',
            borderTop: `1px solid ${theme.accent}30`,
            backdropFilter: 'blur(16px)',
          }}
        >
          {/* Gold progress line at very top of bar */}
          <div
            className="absolute top-0 left-0 h-[2px] transition-all duration-100"
            style={{ width: `${progress}%`, background: theme.accent }}
          />
          {/* Seekable progress track */}
          <div
            className="absolute top-0 left-0 right-0 h-[2px] cursor-pointer"
            style={{ background: `${theme.accent}20` }}
            onClick={seek}
          />

          <div className="flex items-center justify-between px-5 h-16">
            {/* Track name + music note */}
            <div className="flex items-center gap-3 min-w-0">
              <span style={{ color: theme.accent, fontSize: 16, flexShrink: 0 }}>♪</span>
              <span
                className="text-xs tracking-wide truncate"
                style={{ color: theme.primary, fontFamily: theme.font, maxWidth: '40vw' }}
              >
                {trackName}
              </span>
              {duration > 0 && (
                <span
                  className="text-[10px] tracking-widest hidden sm:block"
                  style={{ color: theme.subtext, fontFamily: theme.font, flexShrink: 0 }}
                >
                  {formatDuration(duration)}
                </span>
              )}
            </div>

            {/* Luxury visualizer bars */}
            {tierName === 'luxury' && playing && (
              <div className="flex-1 flex justify-center">
                <VisualizerBars theme={theme} />
              </div>
            )}

            {/* Play / pause button */}
            <motion.button
              onClick={toggle}
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: theme.accent, color: theme.background }}
              animate={playing ? {} : { scale: [1, 1.08, 1] }}
              transition={playing ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon size={18} /> : <PlayIcon size={18} />}
            </motion.button>
          </div>
        </div>
      </>
    )
  }

  // ── BASIC — inline player ────────────────────────────────────────────────────
  return (
    <>
      <section className="py-24 px-6" style={{ background: theme.background }}>
        <div className="max-w-sm mx-auto">
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
              Our Song
            </span>
            <div style={{ flex: 1, height: 1, background: theme.divider }} />
          </motion.div>

          <motion.div
            className="flex flex-col items-center gap-6"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                border: `1px solid ${theme.accent}40`,
                background: `${theme.accent}10`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32" style={{ color: theme.accent }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z" />
              </svg>
            </div>

            <p
              className="text-base tracking-wide text-center"
              style={{ color: theme.primary, fontFamily: theme.font }}
            >
              {trackName}
            </p>

            <div
              className="w-full h-px cursor-pointer relative"
              style={{ background: theme.divider }}
              onClick={seek}
            >
              <div
                className="absolute left-0 top-0 h-full transition-all duration-100"
                style={{ width: `${progress}%`, background: theme.accent }}
              />
            </div>

            {duration > 0 && (
              <p
                className="text-xs tracking-widest"
                style={{ color: theme.subtext, fontFamily: theme.font }}
              >
                {formatDuration(duration)}
              </p>
            )}

            <motion.button
              onClick={toggle}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: theme.accent, color: theme.background }}
              animate={playing ? {} : { scale: [1, 1.08, 1] }}
              transition={playing ? {} : { duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              aria-label={playing ? 'Pause' : 'Play'}
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </motion.button>
          </motion.div>

          <audio
            ref={audioRef}
            src={encodedUrl}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
            onEnded={onEnded}
            preload="metadata"
          />
        </div>
      </section>

      {showBanner && (
        <div
          className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4"
          style={{
            background: 'rgba(5,4,10,0.95)',
            borderTop: `1px solid ${theme.accent}50`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <button
            onClick={handleBannerPlay}
            className="flex items-center gap-3 text-sm tracking-[0.15em]"
            style={{ color: theme.accent, fontFamily: theme.font }}
          >
            <span style={{ fontSize: 18 }}>♪</span>
            <span>Tap to play our song</span>
          </button>
          <button
            onClick={() => setShowBanner(false)}
            className="text-lg leading-none px-2"
            style={{ color: theme.subtext }}
            aria-label="Dismiss"
          >
            ×
          </button>
        </div>
      )}
    </>
  )
}
