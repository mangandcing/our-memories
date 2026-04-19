'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../lib/supabase-admin'
import { createClient } from '../../lib/supabase-server'

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

  const { error } = await admin
    .from('pages')
    .update({ is_published: true, status: 'active', expires_at: expiresAt })
    .eq('id', pageId)

  if (error) return { error: error.message }

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
