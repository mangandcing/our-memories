'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '../../../../lib/supabase-server'
import { createAdminClient } from '../../../../lib/supabase-admin'

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
  } catch {}
}

export async function savePage(
  pageId: string,
  payload: {
    title: string
    content: Record<string, unknown>
    gift_enabled: boolean
    gift_phone: string | null
    gift_note: string | null
    gift_qr_url: string | null
  }
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('pages')
    .update({
      title: payload.title,
      content: payload.content,
      gift_enabled: payload.gift_enabled,
      gift_phone: payload.gift_phone,
      gift_note: payload.gift_note,
      gift_qr_url: payload.gift_qr_url,
    })
    .eq('id', pageId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath(`/portal/pages/${pageId}/edit`)
  revalidatePath(`/portal/preview`)
  return { success: true }
}

export async function submitForReview(
  pageId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: page, error: fetchError } = await supabase
    .from('pages')
    .select(`
      id, title,
      tiers!pages_tier_id_fkey (name),
      users!pages_user_id_fkey (full_name)
    `)
    .eq('id', pageId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !page) return { success: false, error: 'Page not found' }

  const { error } = await supabase
    .from('pages')
    .update({ status: 'pending_review' })
    .eq('id', pageId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  const tierName = (page as any).tiers?.name ?? 'Unknown'
  const userName = (page as any).users?.full_name ?? 'Unknown'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://our-memories.store'

  await sendTelegramAlert(
    `<b>Page Ready for Review</b>\nPage: ${page.title}\nCustomer: ${userName}\nTier: ${tierName}\nView in admin: ${siteUrl}/admin/pages`
  )

  revalidatePath('/portal/pages')
  revalidatePath('/admin/pages')
  return { success: true }
}

export async function deleteMediaFile(
  mediaId: string,
  storagePath: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const admin = createAdminClient()
  await admin.storage.from('page-media').remove([storagePath])

  const { error } = await supabase
    .from('media_files')
    .delete()
    .eq('id', mediaId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }
  return { success: true }
}

export async function updateMediaOrder(
  updates: { id: string; sort_order: number }[]
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  await Promise.all(
    updates.map(({ id, sort_order }) =>
      supabase
        .from('media_files')
        .update({ sort_order })
        .eq('id', id)
        .eq('user_id', user.id)
    )
  )

  return { success: true }
}

export async function updateGalleryVisibility(
  pageId: string,
  value: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { success: false, error: 'Not authenticated' }

  const { error } = await supabase
    .from('pages')
    .update({ show_in_gallery: value })
    .eq('id', pageId)
    .eq('user_id', user.id)

  if (error) return { success: false, error: error.message }

  revalidatePath('/gallery')
  return { success: true }
}
