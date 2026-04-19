'use server'

import { createClient } from './supabase-server'

export interface GuestMessageRecord {
  id: string
  author_name: string
  message: string
  created_at: string
}

export async function getApprovedMessages(pageId: string): Promise<GuestMessageRecord[]> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('guest_messages')
    .select('id, author_name, message, created_at')
    .eq('page_id', pageId)
    .eq('approved', true)
    .order('created_at', { ascending: false })
  return (data ?? []) as GuestMessageRecord[]
}

export async function submitGuestMessage(
  pageId: string,
  name: string,
  message: string,
  autoApprove: boolean
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { error } = await supabase.from('guest_messages').insert({
    page_id: pageId,
    author_name: name.trim(),
    message: message.trim(),
    approved: autoApprove,
  })
  if (error) return { success: false, error: error.message }
  return { success: true }
}
