'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'
import { lightCandle, getCandleCount } from '../../lib/actions'

function FlameUnlit({ accent }: { accent: string }) {
  return (
    <div
      style={{
        width: 16, height: 26,
        background: `${accent}18`,
        borderRadius: '50% 50% 38% 38% / 58% 58% 42% 42%',
        border: `1px dashed ${accent}35`,
      }}
    />
  )
}

function FlameLit({ isLuxury }: { isLuxury: boolean }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', width: 48, height: 44 }}>
      {/* Outer ambient glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: isLuxury ? 56 : 44,
          height: isLuxury ? 56 : 44,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,140,0,0.35) 0%, rgba(255,80,0,0.12) 50%, transparent 70%)',
          bottom: -8,
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(6px)',
        }}
        animate={{ scale: [1, 1.25, 0.95, 1.15, 1], opacity: [0.7, 1, 0.65, 0.95, 0.7] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Inner hot core glow */}
      <motion.div
        style={{
          position: 'absolute',
          width: 22, height: 22,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,240,120,0.9) 0%, rgba(255,160,20,0.5) 50%, transparent 70%)',
          bottom: 4,
          left: '50%',
          transform: 'translateX(-50%)',
          filter: 'blur(4px)',
        }}
        animate={{ scale: [1, 1.2, 0.9, 1.1, 1], opacity: [0.8, 1, 0.7, 0.9, 0.8] }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
      />

      {/* Flame body */}
      <motion.div
        style={{
          width: 18,
          background: 'linear-gradient(180deg, #fff4a0 0%, #ffb020 35%, #ff6a00 70%, #cc3300 100%)',
          borderRadius: '50% 50% 38% 38% / 58% 58% 42% 42%',
          transformOrigin: 'bottom center',
          position: 'relative',
          zIndex: 1,
          boxShadow: '0 0 8px rgba(255,130,0,0.8), 0 0 16px rgba(255,80,0,0.4)',
        }}
        animate={{
          height: [26, 22, 26, 24, 26],
          scaleX: [1, 0.88, 1.08, 0.94, 1],
          rotate: [-2, 3, -3, 2, -2],
          opacity: [1, 0.92, 1, 0.95, 1],
        }}
        transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Luxury: second wisp flame */}
      {isLuxury && (
        <motion.div
          style={{
            position: 'absolute',
            width: 8,
            background: 'linear-gradient(180deg, #ffe88a 0%, #ff9010 60%, transparent 100%)',
            borderRadius: '50% 50% 38% 38% / 58% 58% 42% 42%',
            transformOrigin: 'bottom center',
            bottom: 8,
            left: '50%',
            marginLeft: 4,
            opacity: 0.7,
          }}
          animate={{
            height: [14, 10, 16, 11, 14],
            rotate: [4, 10, 2, 8, 4],
            opacity: [0.7, 0.4, 0.8, 0.5, 0.7],
          }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.25 }}
        />
      )}
    </div>
  )
}

export default function CandleSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const storageKey = `candle_lit_${page.slug}`
  const [lit, setLit] = useState(false)
  const [count, setCount] = useState<number | null>(null)
  const isPremiumOrLuxury = tierName === 'premium' || tierName === 'luxury'
  const isLuxury = tierName === 'luxury'

  useEffect(() => {
    setLit(localStorage.getItem(storageKey) === 'true')
    if (isPremiumOrLuxury) {
      getCandleCount(page.id).then(setCount)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLight() {
    if (lit) return
    setLit(true)
    localStorage.setItem(storageKey, 'true')
    if (isPremiumOrLuxury) {
      const result = await lightCandle(page.id)
      setCount(result.count)
    }
  }

  return (
    <section
      className="py-24 px-6 relative overflow-hidden transition-colors duration-1000"
      style={{ background: theme.surface }}
    >
      {/* Warm ambient light — appears when candle is lit */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(255,120,20,0.12) 0%, rgba(200,80,10,0.06) 35%, transparent 65%)',
        }}
        animate={{ opacity: lit ? 1 : 0 }}
        transition={{ duration: 1.2, ease: 'easeInOut' }}
      />

      <div className="max-w-sm mx-auto text-center relative">
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
            Light a Candle
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        <motion.div
          className="flex flex-col items-center gap-8"
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <button
            onClick={handleLight}
            disabled={lit}
            aria-label={lit ? 'Candle is lit' : 'Light a candle'}
            className="flex flex-col items-center gap-0 transition-opacity disabled:cursor-default"
            style={{ opacity: lit ? 1 : 0.8 }}
          >
            {/* Candle glow halo — behind everything */}
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {lit && (
                <motion.div
                  style={{
                    position: 'absolute',
                    width: 120, height: 120,
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(255,140,0,0.22) 0%, rgba(255,80,0,0.10) 40%, transparent 70%)',
                    top: 10,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    filter: 'blur(8px)',
                    pointerEvents: 'none',
                  }}
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              )}

              <div style={{ height: 44, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
                {lit
                  ? <FlameLit isLuxury={isLuxury} />
                  : <FlameUnlit accent={theme.accent} />
                }
              </div>
              <div style={{ width: 2, height: 8, background: '#4a3a20', borderRadius: 1 }} />
              <motion.div
                style={{
                  width: 30, height: 84,
                  background: `linear-gradient(180deg, ${theme.primary}f5 0%, ${theme.primary}c0 100%)`,
                  borderRadius: '2px 2px 3px 3px',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: lit
                    ? '0 0 60px rgba(255,140,0,0.4), 0 0 120px rgba(255,100,0,0.2)'
                    : 'none',
                }}
                animate={{
                  boxShadow: lit
                    ? '0 0 60px rgba(255,140,0,0.4), 0 0 120px rgba(255,100,0,0.2)'
                    : '0 0 0px transparent',
                }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 6,
                  width: 7, height: 16,
                  background: `${theme.primary}dd`,
                  borderRadius: '0 0 50% 50%',
                }} />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(90deg, transparent 70%, rgba(0,0,0,0.07) 100%)',
                }} />
                {/* Warm tint overlay when lit */}
                <motion.div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(180deg, rgba(255,140,0,0.15) 0%, rgba(255,80,0,0.05) 100%)',
                  }}
                  animate={{ opacity: lit ? 1 : 0 }}
                  transition={{ duration: 1, ease: 'easeInOut' }}
                />
              </motion.div>
              <div
                style={{
                  width: 36, height: 6,
                  background: `${theme.primary}40`,
                  borderRadius: '0 0 4px 4px',
                }}
              />
            </div>
          </button>

          {!lit && (
            <p
              className="text-xs tracking-[0.2em] uppercase"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              Tap to light
            </p>
          )}

          {lit && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="text-sm tracking-wide"
              style={{ color: theme.primary, fontFamily: theme.font }}
            >
              {isLuxury ? 'Their memory lives on' : 'A candle burns in their memory'}
            </motion.p>
          )}

          {isPremiumOrLuxury && count !== null && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs tracking-[0.18em]"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              {count} {count === 1 ? 'candle' : 'candles'} lit
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  )
}

