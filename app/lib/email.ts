'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const from = process.env.FROM_EMAIL ?? 'noreply@our-memories.store'
  await resend.emails.send({ from, to, subject, html })
}
