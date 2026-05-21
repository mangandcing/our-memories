'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../lib/supabase-admin'
import { createClient } from '../../lib/supabase-server'
import { sendEmail } from '../../lib/email'
import { pagePublishedEmail } from '../../lib/emails/page-published'
import { contentRejectedEmail } from '../../lib/emails/content-rejected'

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

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return null
  return user
}

export async function publishPage(pageId: string, orderId: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .select('duration_prices!orders_duration_price_id_fkey (duration_months)')
    .eq('id', orderId)
    .single()

  if (orderError) return { error: orderError.message }

  const durationMonths = (order as any).duration_prices?.duration_months ?? 0
  const expiresAt = durationMonths > 0
    ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
    : null

  const { data: pageData } = await admin
    .from('pages')
    .select('title, slug, users!pages_user_id_fkey (full_name, email)')
    .eq('id', pageId)
    .single()

  const { error } = await admin
    .from('pages')
    .update({ is_published: true, status: 'active', expires_at: expiresAt })
    .eq('id', pageId)

  if (error) return { error: error.message }

  if (pageData) {
    const customerEmail = (pageData as any).users?.email
    if (customerEmail) {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://our-memories.store'
      const expiryFormatted = expiresAt
        ? new Date(expiresAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
        : 'No expiry'
      sendEmail({
        to: customerEmail,
        subject: "Your Page is Live! 🎉",
        html: pagePublishedEmail({
          customerName: (pageData as any).users?.full_name ?? customerEmail,
          pageTitle: pageData.title,
          pageUrl: `${siteUrl}/p/${pageData.slug}`,
          expiryDate: expiryFormatted,
        }),
      }).catch(console.error)
    }
  }

  revalidatePath('/admin/pages')
  revalidatePath('/admin')
  return { success: true }
}

export async function unpublishPage(pageId: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { error } = await admin
    .from('pages')
    .update({ is_published: false, status: 'draft' })
    .eq('id', pageId)

  if (error) return { error: error.message }

  revalidatePath('/admin/pages')
  revalidatePath('/admin')
  return { success: true }
}

export async function adminToggleGallery(pageId: string, value: boolean) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { error } = await admin
    .from('pages')
    .update({ show_in_gallery: value })
    .eq('id', pageId)

  if (error) return { error: error.message }

  revalidatePath('/admin/pages')
  revalidatePath('/gallery')
  return { success: true }
}

export async function rejectContent(pageId: string, reason: string, flaggedSections: string[]) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: pageData, error } = await admin
    .from('pages')
    .update({ status: 'draft', admin_note: reason })
    .eq('id', pageId)
    .select('title, slug, users!pages_user_id_fkey (full_name, email)')
    .single()

  if (error) return { error: error.message }

  await sendTelegramAlert(
    `<b>Content Rejected</b>\nPage: ${pageData.title}\nSections: ${flaggedSections.join(', ') || 'General'}\nReason: ${reason}`
  )

  const customerEmail = (pageData as any).users?.email
  if (customerEmail) {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://our-memories.store'
    sendEmail({
      to: customerEmail,
      subject: 'Content Review — Changes Needed',
      html: contentRejectedEmail({
        customerName: (pageData as any).users?.full_name ?? customerEmail,
        pageTitle: pageData.title,
        flaggedSections,
        reason,
        editorUrl: `${siteUrl}/portal/pages/${pageId}/edit`,
      }),
    }).catch(console.error)
  }

  revalidatePath('/admin/pages')
  return { success: true }
}
