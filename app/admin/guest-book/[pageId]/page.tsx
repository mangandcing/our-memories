import { redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase-server'
import { createAdminClient } from '../../../lib/supabase-admin'
import GuestBookAdminView from './GuestBookAdminView'

export const revalidate = 0

export default async function AdminGuestBookPage({
  params,
}: {
  params: Promise<{ pageId: string }>
}) {
  const { pageId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (!adminEmails.includes(user.email ?? '')) redirect('/')

  const admin = createAdminClient()

  const { data: pageData } = await admin
    .from('pages')
    .select('title, slug')
    .eq('id', pageId)
    .single()

  const { data: raw } = await admin
    .from('guest_messages')
    .select('id, author_name, message, approved, created_at')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })

  const messages = (raw ?? []).map((m) => ({
    id: m.id as string,
    author_name: m.author_name as string,
    message: m.message as string,
    approved: m.approved as boolean,
    created_at: m.created_at as string,
  }))

  return (
    <GuestBookAdminView
      pageId={pageId}
      pageTitle={(pageData as { title: string; slug: string } | null)?.title ?? pageId}
      pageSlug={(pageData as { title: string; slug: string } | null)?.slug ?? ''}
      messages={messages}
    />
  )
}
