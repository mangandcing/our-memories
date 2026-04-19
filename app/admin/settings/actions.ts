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

export async function updateSetting(key: string, value: string) {
  if (!(await assertAdmin())) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('admin_settings')
    .upsert({ key, value }, { onConflict: 'key' })

  if (error) return { error: error.message }

  revalidatePath('/admin/settings')
  return { success: true }
}
