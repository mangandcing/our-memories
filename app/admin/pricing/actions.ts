'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../lib/supabase-admin'
import { createClient } from '../../lib/supabase-server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  return adminEmails.includes(user.email ?? '')
}

export async function updateDurationPrice(id: string, price: number) {
  if (!(await assertAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('duration_prices')
    .update({ price })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/pricing')
  return { success: true }
}

export async function updateDurationLabel(id: string, label: string) {
  if (!(await assertAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('duration_prices')
    .update({ label })
    .eq('id', id)

  if (error) return { error: error.message }

  revalidatePath('/admin/pricing')
  return { success: true }
}
