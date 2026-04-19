'use server'

import { createClient } from '../../../../lib/supabase-server'

export type OrderDetails = {
  id: string
  amount: number
  currency: string
  payment_method: string
  status: string
  tiers: { name: string }
  duration_prices: { price: number; label: string; duration_months: number } | null
  pages: { title: string }
  users: { full_name: string | null; email: string }
}

export type PaymentSettings = {
  kbz_pay_phone: string
  kbz_pay_qr_url: string
  wave_money_phone: string
  aya_pay_phone: string
  bangkok_bank_qr_url: string
  true_money_phone: string
}

export async function getOrderWithDetails(orderId: string): Promise<OrderDetails | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data, error } = await supabase
    .from('orders')
    .select('id, amount, currency, payment_method, status, tiers(name), duration_prices(price, label, duration_months), pages(title), users!user_id(full_name, email)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (error) console.error('[getOrderWithDetails]', error.message)
  return data as OrderDetails | null
}

export async function getPaymentSettings(): Promise<PaymentSettings> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('admin_settings')
    .select('key, value')

  const map: Record<string, string> = {}
  for (const row of data ?? []) {
    map[row.key] = row.value
  }

  return {
    kbz_pay_phone: map['kbz_pay_phone'] ?? '',
    kbz_pay_qr_url: map['kbz_pay_qr_url'] ?? '',
    wave_money_phone: map['wave_money_phone'] ?? '',
    aya_pay_phone: map['aya_pay_phone'] ?? '',
    bangkok_bank_qr_url: map['bangkok_bank_qr_url'] ?? '',
    true_money_phone: map['true_money_phone'] ?? '',
  }
}

export async function uploadScreenshot(
  orderId: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const file = formData.get('screenshot') as File | null
  if (!file) return { success: false, error: 'No file provided' }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(file.type)) {
    return { success: false, error: 'Only JPG, PNG, or WEBP images are allowed' }
  }

  const maxBytes = 5 * 1024 * 1024
  if (file.size > maxBytes) {
    return { success: false, error: 'File must be under 5MB' }
  }

  const { data: order } = await supabase
    .from('orders')
    .select('id, status, amount, tiers(name), pages(title), users!user_id(full_name, email)')
    .eq('id', orderId)
    .eq('user_id', user.id)
    .single()

  if (!order) return { success: false, error: 'Order not found' }
  if (order.status !== 'awaiting_payment') {
    return { success: false, error: 'Screenshot already uploaded for this order' }
  }

  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg'
  const storagePath = `${user.id}/${orderId}/screenshot.${ext}`

  const arrayBuffer = await file.arrayBuffer()
  const { error: uploadError } = await supabase.storage
    .from('payment-screenshots')
    .upload(storagePath, arrayBuffer, {
      contentType: file.type,
      upsert: true,
    })

  if (uploadError) return { success: false, error: uploadError.message }

  const { data: urlData } = supabase.storage
    .from('payment-screenshots')
    .getPublicUrl(storagePath)

  const screenshotUrl = urlData.publicUrl

  const { error: updateError } = await supabase
    .from('orders')
    .update({ screenshot_url: screenshotUrl, status: 'pending' })
    .eq('id', orderId)
    .eq('user_id', user.id)

  if (updateError) return { success: false, error: updateError.message }

  await sendTelegramAlert({
    orderId,
    customerName: (order.users as unknown as { full_name: string | null; email: string }).full_name
      ?? (order.users as unknown as { full_name: string | null; email: string }).email,
    tierName: (order.tiers as unknown as { name: string }).name,
    amount: order.amount,
  })

  return { success: true }
}

async function sendTelegramAlert({
  orderId,
  customerName,
  tierName,
  amount,
}: {
  orderId: string
  customerName: string
  tierName: string
  amount: number
}) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://our-memories.store'
  const adminUrl = `${appUrl}/admin/orders/${orderId}`

  const text =
    `New Payment Uploaded\n` +
    `Order: ${orderId}\n` +
    `Customer: ${customerName}\n` +
    `Tier: ${tierName}\n` +
    `Amount: ${Number(amount).toLocaleString()} MMK\n` +
    `View in admin: ${adminUrl}`

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text }),
  }).catch(() => {})
}
