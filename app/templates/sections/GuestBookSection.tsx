'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'
import { getApprovedMessages, submitGuestMessage } from '../../lib/guest-book-actions'

interface GuestMessage {
  id: string
  author_name: string
  message: string
  created_at: string
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

function MessageCard({ msg, theme, index, tierName }: {
  msg: GuestMessage
  theme: SectionProps['theme']
  index: number
  tierName: SectionProps['tierName']
}) {
  const isLuxury = tierName === 'luxury'
  const date = new Date(msg.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: [0.16, 1, 0.3, 1] }}
      style={{
        background: '#111',
        border: `1px solid ${isLuxury ? theme.accent + '30' : theme.divider}`,
        borderRadius: 6,
        padding: '1.25rem 1.5rem',
        boxShadow: isLuxury ? `0 0 16px ${theme.accent}0a` : 'none',
      }}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p
          className="text-sm font-medium tracking-wide"
          style={{ color: theme.accent, fontFamily: theme.headingFont }}
        >
          {msg.author_name}
        </p>
        <p
          className="text-[10px] tracking-[0.12em] whitespace-nowrap"
          style={{ color: theme.subtext, fontFamily: theme.font, opacity: 0.7 }}
        >
          {date}
        </p>
      </div>
      <p
        className="text-sm leading-relaxed"
        style={{ color: '#e8dcc8', fontFamily: theme.font }}
      >
        {msg.message}
      </p>
    </motion.div>
  )
}

export default function GuestBookSection({ page, theme, animations, tierName }: SectionProps) {
  const variants = getMotionVariants(animations)
  const isPremiumOrLuxury = tierName === 'premium' || tierName === 'luxury'
  const isLuxury = tierName === 'luxury'

  const [messages, setMessages] = useState<GuestMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [name, setName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getApprovedMessages(page.id).then((msgs) => {
      setMessages(msgs)
      setLoading(false)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !message.trim()) return
    setSubmitting(true)
    setError(null)
    const result = await submitGuestMessage(page.id, name, message, isLuxury)
    if (result.success) {
      setSubmitted(true)
      setName('')
      setMessage('')
      if (isLuxury) {
        const newMsg: GuestMessage = {
          id: Date.now().toString(),
          author_name: name.trim(),
          message: message.trim(),
          created_at: new Date().toISOString(),
        }
        setMessages((prev) => [newMsg, ...prev])
      }
    } else {
      setError(result.error ?? 'Something went wrong')
    }
    setSubmitting(false)
  }

  const headingContent = isLuxury
    ? <ShimmerText theme={theme}>Guest Book</ShimmerText>
    : 'Guest Book'

  return (
    <section className="py-24 px-6" style={{ background: theme.background }}>
      <div className="max-w-xl mx-auto">
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
            style={{ color: isLuxury ? 'unset' : theme.subtext, fontFamily: theme.font }}
          >
            {headingContent}
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        {isPremiumOrLuxury && (
          <motion.div
            className="mb-12"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {submitted && !isLuxury ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm py-8"
                style={{ color: theme.subtext, fontFamily: theme.font }}
              >
                Thank you. Your message is pending review.
              </motion.p>
            ) : submitted && isLuxury ? (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-sm py-4"
                style={{ color: theme.accent, fontFamily: theme.font }}
              >
                Your message has been shared.
              </motion.p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  maxLength={80}
                  required
                  className="w-full bg-transparent text-sm px-0 py-3 outline-none placeholder-current"
                  style={{
                    color: theme.primary,
                    fontFamily: theme.font,
                    borderBottom: `1px solid ${theme.divider}`,
                    caretColor: theme.accent,
                  }}
                />
                <textarea
                  placeholder="Leave a message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={500}
                  required
                  rows={3}
                  className="w-full bg-transparent text-sm px-0 py-3 outline-none resize-none placeholder-current"
                  style={{
                    color: theme.primary,
                    fontFamily: theme.font,
                    borderBottom: `1px solid ${theme.divider}`,
                    caretColor: theme.accent,
                  }}
                />
                {error && (
                  <p className="text-xs" style={{ color: '#e87070', fontFamily: theme.font }}>{error}</p>
                )}
                <div className="flex justify-end mt-2">
                  <motion.button
                    type="submit"
                    disabled={submitting || !name.trim() || !message.trim()}
                    className="text-xs tracking-[0.25em] uppercase px-6 py-2.5 transition-opacity disabled:opacity-40"
                    style={{
                      color: theme.background,
                      background: theme.accent,
                      fontFamily: theme.font,
                      borderRadius: 2,
                    }}
                    whileHover={{ opacity: 0.85 }}
                  >
                    {submitting ? '…' : 'Send'}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        )}

        {loading ? (
          <div className="flex justify-center py-8">
            <div
              className="w-4 h-4 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: `${theme.accent}40`, borderTopColor: theme.accent }}
            />
          </div>
        ) : messages.length === 0 ? (
          <motion.p
            className="text-center text-sm py-8"
            style={{ color: theme.subtext, fontFamily: theme.font }}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            Be the first to leave a message
          </motion.p>
        ) : (
          <AnimatePresence>
            <div className="flex flex-col gap-4">
              {messages.map((msg, i) => (
                <MessageCard key={msg.id} msg={msg} theme={theme} index={i} tierName={tierName} />
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </section>
  )
}
