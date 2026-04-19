'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '../../../lib/supabase-admin'
import { createClient } from '../../../lib/supabase-server'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim())
  if (!adminEmails.includes(user.email ?? '')) return null
  return user
}

export async function approveMessage(messageId: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('guest_messages')
    .update({ approved: true })
    .eq('id', messageId)

  if (error) return { error: error.message }
  revalidatePath('/admin/pages')
  return { success: true }
}

export async function rejectMessage(messageId: string) {
  const user = await assertAdmin()
  if (!user) return { error: 'Unauthorized' }

  const admin = createAdminClient()
  const { error } = await admin
    .from('guest_messages')
    .delete()
    .eq('id', messageId)

  if (error) return { error: error.message }
  return { success: true }
}
