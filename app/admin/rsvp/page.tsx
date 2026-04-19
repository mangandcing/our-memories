import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase-server'
import { createAdminClient } from '../../lib/supabase-admin'
import RsvpAdminView from './RsvpAdminView'

export const revalidate = 0

export default async function AdminRsvpPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const adminEmails = (process.env.ADMIN_EMAILS ?? '').split(',').map((e) => e.trim()).filter(Boolean)
  if (!adminEmails.includes(user.email ?? '')) redirect('/')

  const admin = createAdminClient()

  const { data: raw } = await admin
    .from('rsvp_responses')
    .select('id, page_id, name, status, guest_count, phone, email, message, created_at, pages!rsvp_responses_page_id_fkey(title)')
    .order('created_at', { ascending: false })

  const rsvps = (raw ?? []).map((r) => ({
    id: r.id,
    page_id: r.page_id,
    pageTitle: (r.pages as unknown as { title: string } | null)?.title ?? '—',
    name: r.name,
    status: r.status as 'attending' | 'not_attending' | 'maybe',
    guest_count: r.guest_count,
    phone: r.phone,
    email: r.email,
    message: r.message,
    created_at: r.created_at,
  }))

  const pageMap = new Map<string, string>()
  for (const r of rsvps) {
    if (!pageMap.has(r.page_id)) pageMap.set(r.page_id, r.pageTitle)
  }
  const pages = Array.from(pageMap.entries()).map(([id, title]) => ({ id, title }))

  return <RsvpAdminView rsvps={rsvps} pages={pages} />
}
