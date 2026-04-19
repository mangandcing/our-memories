'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'
import { submitRsvp } from '../../lib/actions'

type Status = 'attending' | 'not_attending' | 'maybe'

const statusOptions: { value: Status; label: string }[] = [
  { value: 'attending', label: 'Attending' },
  { value: 'maybe', label: 'Maybe' },
  { value: 'not_attending', label: "Can't Make It" },
]

const statusMessages: Record<Status, string> = {
  attending: "We can't wait to see you!",
  not_attending: 'We\'ll miss you dearly.',
  maybe: 'We hope you can make it!',
}

const statusLabels: Record<Status, string> = {
  attending: 'Attending',
  not_attending: 'Not Attending',
  maybe: 'Maybe',
}

function CheckIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}

function CopyIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

export default function RsvpSection({ page, theme, animations }: SectionProps) {
  const variants = getMotionVariants(animations)
  const rsvpEnabled = page.content.rsvpEnabled === true
  const accessCode = ((page.content.accessCode as string | undefined) ?? '').trim()

  const [codeInput, setCodeInput] = useState('')
  const [codeUnlocked, setCodeUnlocked] = useState(!accessCode)
  const [codeError, setCodeError] = useState('')

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<Status>('attending')
  const [guestCount, setGuestCount] = useState(1)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [alreadySubmitted, setAlreadySubmitted] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const flag = localStorage.getItem(`rsvp_${page.id}`)
      if (flag) setAlreadySubmitted(true)
    }
  }, [page.id])

  if (!rsvpEnabled) return null

  const inputStyle: React.CSSProperties = {
    background: 'transparent',
    border: `1px solid ${theme.divider}`,
    borderRadius: 2,
    color: theme.text,
    fontFamily: theme.font,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    width: '100%',
    outline: 'none',
  }

  function handleCodeSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (codeInput.trim() === accessCode) {
      setCodeUnlocked(true)
      setCodeError('')
    } else {
      setCodeError('Incorrect code. Please check your invitation.')
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSubmitting(true)
    setError('')
    const result = await submitRsvp(page.id, { name, phone, email, status, guestCount, message })
    setSubmitting(false)
    if (result.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(`rsvp_${page.id}`, '1')
      }
      setSubmitted(true)
    } else {
      setError(result.error ?? 'Something went wrong. Please try again.')
    }
  }

  function handleCopyLink() {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="py-24 px-6" style={{ background: theme.surface }}>
      <div className="max-w-md mx-auto">
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
            Will You Be There?
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        {alreadySubmitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="w-px h-12 mx-auto mb-8" style={{ background: theme.accent }} />
            <p className="text-base font-light tracking-wide" style={{ color: theme.subtext, fontFamily: theme.font }}>
              You have already submitted your response.
            </p>
          </motion.div>
        ) : submitted ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-8"
              style={{ border: `1px solid ${theme.accent}`, color: theme.accent }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <CheckIcon />
            </motion.div>

            <motion.p
              className="text-xl font-light tracking-wide mb-2"
              style={{ fontFamily: theme.headingFont, color: theme.primary }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Thank you,{' '}
              <span style={{ color: theme.accent }}>{name}</span>
            </motion.p>

            <motion.p
              className="text-xs tracking-[0.2em] uppercase mb-1"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {statusLabels[status]}
            </motion.p>

            <motion.div
              className="mx-auto my-7"
              style={{ width: 44, height: 1, background: theme.accent }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            />

            <motion.p
              className="text-sm mb-8"
              style={{ color: theme.subtext, fontFamily: theme.font }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
            >
              {statusMessages[status]}
            </motion.p>

            <motion.button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs tracking-[0.2em] uppercase transition-opacity hover:opacity-70"
              style={{
                border: `1px solid ${theme.accent}40`,
                color: theme.accent,
                fontFamily: theme.font,
                borderRadius: 2,
                background: 'transparent',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.75 }}
            >
              <CopyIcon />
              {copied ? 'Copied!' : 'Share this page'}
            </motion.button>
          </motion.div>
        ) : !codeUnlocked ? (
          <motion.form
            onSubmit={handleCodeSubmit}
            className="flex flex-col gap-4"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <p
              className="text-sm text-center mb-2"
              style={{ color: theme.subtext, fontFamily: theme.font }}
            >
              This page is private. Enter the access code from your invitation.
            </p>
            <input
              type="text"
              placeholder="Access code"
              value={codeInput}
              onChange={(e) => setCodeInput(e.target.value)}
              required
              style={inputStyle}
            />
            {codeError && (
              <p className="text-xs" style={{ color: '#e05a5a', fontFamily: theme.font }}>
                {codeError}
              </p>
            )}
            <button
              type="submit"
              className="py-4 text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70"
              style={{
                background: theme.accent,
                color: theme.background,
                fontFamily: theme.font,
                border: 'none',
                borderRadius: 2,
              }}
            >
              Unlock
            </button>
          </motion.form>
        ) : (
          <motion.form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <input
              type="text"
              placeholder="Your name *"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={inputStyle}
            />

            <div className="grid grid-cols-3 gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className="min-h-[44px] text-xs tracking-widest uppercase transition-all duration-200"
                  style={{
                    border: `1px solid ${status === opt.value ? theme.accent : theme.divider}`,
                    borderRadius: 2,
                    background: status === opt.value ? `${theme.accent}18` : 'transparent',
                    color: status === opt.value ? theme.accent : theme.subtext,
                    fontFamily: theme.font,
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {status === 'attending' && (
              <div className="flex items-center gap-4">
                <span
                  className="text-sm"
                  style={{ color: theme.subtext, fontFamily: theme.font, whiteSpace: 'nowrap' }}
                >
                  Number of guests
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.max(1, guestCount - 1))}
                    className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-70"
                    style={{ border: `1px solid ${theme.divider}`, color: theme.text, borderRadius: 2 }}
                  >
                    &minus;
                  </button>
                  <span className="w-6 text-center" style={{ color: theme.primary, fontFamily: theme.font }}>
                    {guestCount}
                  </span>
                  <button
                    type="button"
                    onClick={() => setGuestCount(Math.min(20, guestCount + 1))}
                    className="w-11 h-11 flex items-center justify-center transition-opacity hover:opacity-70"
                    style={{ border: `1px solid ${theme.divider}`, color: theme.text, borderRadius: 2 }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <input
              type="tel"
              placeholder="Phone number (optional)"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={inputStyle}
            />

            <input
              type="email"
              placeholder="Email address (optional)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
            />

            <textarea
              placeholder="Leave a message (optional)"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              style={{ ...inputStyle, resize: 'none' }}
            />

            {error && (
              <p className="text-xs" style={{ color: '#e05a5a', fontFamily: theme.font }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="py-4 text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-70 disabled:opacity-40"
              style={{
                background: theme.accent,
                color: theme.background,
                fontFamily: theme.font,
                border: 'none',
                borderRadius: 2,
              }}
            >
              {submitting ? 'Sending...' : 'Send Response'}
            </button>
          </motion.form>
        )}
      </div>
    </section>
  )
}
