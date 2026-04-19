'use client'

import { motion } from 'framer-motion'
import type { SectionProps } from '../types'
import { getMotionVariants } from '../types'

export default function GiftSection({ page, theme, animations }: SectionProps) {
  const variants = getMotionVariants(animations)

  if (!page.gift_enabled) return null

  return (
    <section className="py-24 px-6" style={{ background: theme.surface }}>
      <div className="max-w-sm mx-auto text-center">
        <motion.div
          className="flex items-center gap-4 mb-12"
          variants={variants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
          <span
            className="text-xs tracking-widest uppercase"
            style={{ color: theme.subtext, fontFamily: theme.font }}
          >
            Gift
          </span>
          <div style={{ flex: 1, height: 1, background: theme.divider }} />
        </motion.div>

        {page.gift_qr_url && (
          <motion.div
            className="flex justify-center mb-8"
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <div
              className="p-3 rounded"
              style={{ background: '#ffffff', display: 'inline-block' }}
            >
              <img
                src={page.gift_qr_url}
                alt="Payment QR Code"
                className="block"
                style={{ width: 180, height: 180, objectFit: 'contain' }}
              />
            </div>
          </motion.div>
        )}

        {page.gift_phone && (
          <motion.p
            className="text-base tracking-widest mb-3"
            style={{ color: theme.primary, fontFamily: theme.font }}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {page.gift_phone}
          </motion.p>
        )}

        {page.gift_note && (
          <motion.p
            className="text-sm leading-relaxed"
            style={{ color: theme.subtext, fontFamily: theme.font }}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {page.gift_note}
          </motion.p>
        )}
      </div>
    </section>
  )
}
