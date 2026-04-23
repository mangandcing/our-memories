'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface PasswordGateProps {
  accessCode: string
  pageId: string
  children: React.ReactNode
}

const ORBS = [
  { size: 400, left: '20%', top: '30%', delay: 0, duration: 7 },
  { size: 550, left: '65%', top: '60%', delay: 2, duration: 9 },
  { size: 300, left: '45%', top: '15%', delay: 4, duration: 6 },
]

function ClosedLock({ color }: { color: string }) {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      <circle cx="12" cy="16" r="1" fill={color} stroke="none" />
    </svg>
  )
}

function OpenLock({ color }: { color: string }) {
  return (
    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 9.9-1" />
      <circle cx="12" cy="16" r="1" fill={color} stroke="none" />
    </svg>
  )
}

export default function PasswordGate({ accessCode, pageId, children }: PasswordGateProps) {
  const storageKey = `pwgate-${pageId}`
  const [checked, setChecked] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [lockOpen, setLockOpen] = useState(false)
  const [input, setInput] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    try {
      if (localStorage.getItem(storageKey) === accessCode) setUnlocked(true)
    } catch {
      // ignore
    }
    setChecked(true)
  }, [storageKey, accessCode])

  useEffect(() => {
    if (checked && !unlocked) setTimeout(() => inputRef.current?.focus(), 300)
  }, [checked, unlocked])

  function submit() {
    if (input === accessCode) {
      setLockOpen(true)
      try { localStorage.setItem(storageKey, accessCode) } catch { /* ignore */ }
      setTimeout(() => setUnlocked(true), 1000)
    } else {
      setError(true)
      setTimeout(() => setError(false), 600)
      setInput('')
    }
  }

  const showGate = !unlocked

  return (
    <>
      {children}
      <AnimatePresence>
        {(!checked || showGate) && (
          <motion.div
            key="gate"
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-hidden"
            style={{ background: '#030205' }}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: 'easeInOut' }}
          >
            {ORBS.map((orb, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full pointer-events-none"
                style={{
                  width: orb.size,
                  height: orb.size,
                  left: orb.left,
                  top: orb.top,
                  transform: 'translate(-50%, -50%)',
                  background: `radial-gradient(circle, #c9a96e${['09', '06', '05'][i]} 0%, transparent 70%)`,
                }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.85, 0.5] }}
                transition={{ duration: orb.duration, repeat: Infinity, ease: 'easeInOut', delay: orb.delay }}
              />
            ))}

            {!checked ? null : (
              <motion.div
                className="relative z-10 flex flex-col items-center gap-8 px-6 w-full max-w-xs"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  animate={lockOpen ? { scale: [1, 1.2, 1], rotate: [0, -8, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {lockOpen ? <OpenLock color="#c9a96e" /> : <ClosedLock color="#c9a96e" />}
                </motion.div>

                <div className="text-center space-y-2.5">
                  <h1
                    className="text-2xl font-light tracking-[0.06em]"
                    style={{ fontFamily: 'Georgia, serif', color: '#f5e6c8' }}
                  >
                    This memory is private
                  </h1>
                  <p
                    className="text-[10px] tracking-[0.3em] uppercase"
                    style={{ color: '#6b6458', fontFamily: 'Georgia, serif' }}
                  >
                    Enter access code
                  </p>
                </div>

                <motion.div
                  className="w-full"
                  animate={error ? { x: [-10, 10, -8, 8, -4, 4, 0] } : {}}
                  transition={{ duration: 0.5, ease: 'easeInOut' }}
                >
                  <input
                    ref={inputRef}
                    type="password"
                    value={input}
                    onChange={(e) => { setInput(e.target.value); setError(false) }}
                    onKeyDown={(e) => e.key === 'Enter' && submit()}
                    className="w-full text-center text-xl tracking-[0.4em] bg-transparent border-0 border-b-[1px] outline-none py-3 transition-colors duration-300"
                    style={{
                      borderColor: error ? '#ef4444' : '#c9a96e35',
                      color: '#f5e6c8',
                      fontFamily: 'Georgia, serif',
                      caretColor: '#c9a96e',
                    }}
                    placeholder="· · · · · ·"
                    autoComplete="off"
                  />
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        className="text-center text-xs mt-3"
                        style={{ color: '#ef4444', fontFamily: 'Georgia, serif' }}
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                      >
                        Incorrect code
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                <motion.button
                  onClick={submit}
                  className="px-9 py-3 rounded-full text-[11px] tracking-[0.3em] uppercase transition-opacity"
                  style={{ background: '#c9a96e', color: '#030205', fontFamily: 'Georgia, serif', fontWeight: 500 }}
                  whileHover={{ opacity: 0.85 }}
                  whileTap={{ scale: 0.97 }}
                >
                  Enter
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
