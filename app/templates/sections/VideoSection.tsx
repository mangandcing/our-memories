'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'

export default function VideoSection({ page, theme }: SectionProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const video = page.media.find((m) => m.type === 'video')
  if (!video) return null

  useEffect(() => {
    const el = containerRef.current
    const vid = videoRef.current
    if (!el || !vid) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            vid.play().catch(() => {})
          } else {
            vid.pause()
          }
        })
      },
      { threshold: 0.4 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ height: '100vh' }}
    >
      <video
        ref={videoRef}
        src={video.url}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.6) 100%)',
        }}
      />
      <motion.div
        className="absolute inset-0 flex items-end justify-center pb-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <p
          className="text-xs tracking-[0.3em] uppercase"
          style={{ color: `${theme.primary}80`, fontFamily: theme.font }}
        >
          {page.title}
        </p>
      </motion.div>
    </section>
  )
}
