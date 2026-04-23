'use client'

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps, MediaFile } from '../types'

const BAR_HEIGHTS = [0.3, 0.5, 0.8, 0.6, 1, 0.7, 0.4, 0.9, 0.6, 0.5, 0.7, 1, 0.4, 0.8, 0.6, 0.3, 0.9, 0.5, 0.7, 0.4]

function VoiceSectionContent({
  page,
  theme,
  voiceFile,
}: SectionProps & { voiceFile: MediaFile }) {
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const senderName = page.content.name1 ?? null

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onEnded = () => { setPlaying(false); setProgress(0) }
    const onTime = () => setProgress(audio.currentTime / (audio.duration || 1))
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('timeupdate', onTime)
    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('timeupdate', onTime)
    }
  }, [])

  function togglePlay() {
    const audio = audioRef.current
    if (!audio) return
    playing ? audio.pause() : audio.play()
  }

  return (
    <section className="py-24 px-6" style={{ background: theme.background }}>
      <div className="max-w-lg mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-4 mb-10">
            <div style={{ flex: 1, height: 1, background: theme.divider }} />
            <span
              className="text-xs tracking-[0.25em] uppercase"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              Voice Message
            </span>
            <div style={{ flex: 1, height: 1, background: theme.divider }} />
          </div>

          <div
            className="rounded-2xl p-8 relative overflow-hidden"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.accent}40`,
              boxShadow: `0 0 48px ${theme.accent}08, inset 0 1px 0 ${theme.accent}15`,
            }}
          >
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at 50% 0%, ${theme.accent}08 0%, transparent 65%)`,
              }}
            />

            <p
              className="text-center text-xs tracking-[0.3em] uppercase mb-1 relative"
              style={{ color: theme.accent, fontFamily: theme.font }}
            >
              A personal message for you
            </p>
            {senderName && (
              <p
                className="text-center text-sm mb-8 relative"
                style={{ color: theme.subtext, fontFamily: theme.headingFont, fontStyle: 'italic' }}
              >
                from {senderName}
              </p>
            )}
            {!senderName && <div className="mb-8" />}

            <div className="flex items-center justify-center gap-[3px] h-16 mb-8 relative">
              {BAR_HEIGHTS.map((h, i) => (
                <motion.div
                  key={i}
                  className="rounded-full"
                  style={{ width: 3, background: theme.accent }}
                  animate={playing ? {
                    height: [`${h * 14}px`, `${h * 56}px`, `${h * 14}px`],
                    opacity: [0.5, 1, 0.5],
                  } : {
                    height: `${h * 14}px`,
                    opacity: 0.22,
                  }}
                  transition={playing ? {
                    duration: 0.55 + (i % 5) * 0.13,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.045,
                  } : { duration: 0.4 }}
                />
              ))}
            </div>

            <div
              className="h-px mb-6 relative overflow-hidden rounded-full"
              style={{ background: `${theme.accent}20` }}
            >
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-300"
                style={{ background: theme.accent, width: `${progress * 100}%` }}
              />
            </div>

            <div className="flex flex-col items-center gap-3 relative">
              <motion.button
                onClick={togglePlay}
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: theme.accent,
                  boxShadow: `0 4px 24px ${theme.accent}40`,
                  color: theme.background,
                }}
                whileHover={{ scale: 1.07 }}
                whileTap={{ scale: 0.95 }}
                aria-label={playing ? 'Pause' : 'Play voice message'}
              >
                {playing ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="4" width="4" height="16" rx="1" />
                    <rect x="14" y="4" width="4" height="16" rx="1" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ marginLeft: 2 }}>
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                )}
              </motion.button>
              <p
                className="text-[10px] tracking-[0.25em] uppercase text-center"
                style={{ color: theme.subtext, fontFamily: theme.font }}
              >
                {playing ? 'Playing\u2026' : 'Press play to hear a personal message'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <audio ref={audioRef} src={voiceFile.url} preload="metadata" />
    </section>
  )
}

export default function VoiceSection(props: SectionProps) {
  const voiceFile = props.page.media.find(
    (m) => m.type === 'audio' && m.file_name === 'voice-message.webm'
  )
  if (!voiceFile || props.tierName !== 'luxury') return null
  return <VoiceSectionContent {...props} voiceFile={voiceFile} />
}
