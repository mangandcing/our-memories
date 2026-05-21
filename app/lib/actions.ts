'use server'

import { createClient } from './supabase-server'
import { sendEmail } from './email'
import { rsvpReceivedEmail } from './emails/rsvp-received'

async function sendTelegramAlert(message: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    })
  } catch {
  }
}

export async function submitRsvp(
  pageId: string,
  data: {
    name: string
    phone: string
    email: string
    status: 'attending' | 'not_attending' | 'maybe'
    guestCount: number
    message: string
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()

  const trimmedName = data.name.trim()

  const { data: existing } = await supabase
    .from('rsvp_responses')
    .select('id')
    .eq('page_id', pageId)
    .ilike('name', trimmedName)
    .maybeSingle()

  if (existing) {
    return { success: false, error: 'You have already submitted a response for this page.' }
  }

  const { error } = await supabase.from('rsvp_responses').insert({
    page_id: pageId,
    name: trimmedName,
    phone: data.phone.trim() || null,
    email: data.email.trim() || null,
    status: data.status,
    guest_count: data.guestCount,
    message: data.message.trim() || null,
  })

  if (error) return { success: false, error: error.message }

  const { data: page } = await supabase
    .from('pages')
    .select('title, slug, users!pages_user_id_fkey (full_name, email)')
    .eq('id', pageId)
    .maybeSingle()

  const { count: attendingCount } = await supabase
    .from('rsvp_responses')
    .select('*', { count: 'exact', head: true })
    .eq('page_id', pageId)
    .eq('status', 'attending')

  const statusLabel =
    data.status === 'attending' ? 'Attending' :
    data.status === 'not_attending' ? 'Not Attending' : 'Maybe'

  await sendTelegramAlert(
    `🎉 <b>New RSVP</b>\nPage: ${page?.title ?? pageId}\nGuest: ${trimmedName}\nStatus: ${statusLabel}\nParty of: ${data.guestCount}\nView: ${process.env.NEXT_PUBLIC_SITE_URL ?? 'https://our-memories.store'}/admin/rsvp`
  )

  const ownerEmail = (page as any)?.users?.email
  if (ownerEmail) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://our-memories.store'
    sendEmail({
      to: ownerEmail,
      subject: `New RSVP — ${trimmedName} is ${statusLabel}`,
      html: rsvpReceivedEmail({
        ownerName: (page as any)?.users?.full_name ?? ownerEmail,
        pageTitle: page?.title ?? 'Your Page',
        guestName: trimmedName,
        status: data.status,
        partySize: data.guestCount,
        message: data.message.trim() || null,
        rsvpListUrl: `${siteUrl}/admin/rsvp`,
        attendingCount: attendingCount ?? 0,
      }),
    }).catch(console.error)
  }

  return { success: true }
}

export async function getCandleCount(pageId: string): Promise<number> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('candle_count')
    .eq('id', pageId)
    .single()
  return (data as { candle_count?: number } | null)?.candle_count ?? 0
}

export async function lightCandle(pageId: string): Promise<{ count: number }> {
  const supabase = await createClient()
  const { data } = await supabase.rpc('increment_candle_count', { p_page_id: pageId })
  return { count: (data as number | null) ?? 0 }
}
