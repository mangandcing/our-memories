'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../lib/supabase-admin'
import { createClient } from '../../lib/supabase-server'

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

export async function approveOrder(orderId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: order, error } = await admin
    .from('orders')
    .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', orderId)
    .select('id, amount, payment_method, users!orders_user_id_fkey (full_name, email)')
    .single()

  if (error) return { error: error.message }

  await sendTelegramAlert(
    `<b>Payment Approved</b>\nCustomer: ${(order as any).users?.full_name ?? 'Unknown'}\nAmount: ${Number((order as any).amount).toLocaleString()} MMK\nMethod: ${(order as any).payment_method?.replace(/_/g, ' ')}`
  )

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}

export async function approveAndPublishOrder(orderId: string, pageId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: order, error: orderError } = await admin
    .from('orders')
    .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
    .eq('id', orderId)
    .select('id, amount, payment_method, duration_prices!orders_duration_price_id_fkey (duration_months), users!orders_user_id_fkey (full_name, email)')
    .single()

  if (orderError) return { error: orderError.message }

  const durationMonths = (order as any).duration_prices?.duration_months ?? 0
  const expiresAt = durationMonths > 0
    ? new Date(Date.now() + durationMonths * 30 * 24 * 60 * 60 * 1000).toISOString()
    : null

  const { error: pageError } = await admin
    .from('pages')
    .update({ is_published: true, status: 'active', expires_at: expiresAt })
    .eq('id', pageId)

  if (pageError) return { error: pageError.message }

  await sendTelegramAlert(
    `<b>Payment Approved + Page Published</b>\nCustomer: ${(order as any).users?.full_name ?? 'Unknown'}\nAmount: ${Number((order as any).amount).toLocaleString()} MMK\nMethod: ${(order as any).payment_method?.replace(/_/g, ' ')}`
  )

  revalidatePath('/admin/orders')
  revalidatePath('/admin/pages')
  revalidatePath('/admin')
  return { success: true }
}

export async function rejectOrder(orderId: string, reason: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Unauthorized' }

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return { error: 'Unauthorized' }

  const admin = createAdminClient()

  const { data: order, error } = await admin
    .from('orders')
    .update({
      status: 'rejected',
      admin_note: reason,
      reviewed_by: user.id,
      reviewed_at: new Date().toISOString(),
    })
    .eq('id', orderId)
    .select('id, amount, users!orders_user_id_fkey (full_name, email)')
    .single()

  if (error) return { error: error.message }

  await sendTelegramAlert(
    `<b>Payment Rejected</b>\nCustomer: ${(order as any).users?.full_name ?? 'Unknown'}\nReason: ${reason}`
  )

  // TODO: send rejection email to customer at (order as any).users?.email

  revalidatePath('/admin/orders')
  revalidatePath('/admin')
  return { success: true }
}

export async function getScreenshotSignedUrl(screenshotUrl: string): Promise<{ signedUrl?: string; error?: string }> {
  const admin = createAdminClient()

  let storagePath = screenshotUrl
  const marker = '/payment-screenshots/'
  const idx = screenshotUrl.indexOf(marker)
  if (idx !== -1) {
    storagePath = screenshotUrl.slice(idx + marker.length).split('?')[0]
  }

  const { data, error } = await admin.storage
    .from('payment-screenshots')
    .createSignedUrl(storagePath, 3600)

  if (error) return { error: error.message }
  return { signedUrl: data.signedUrl }
}
