import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../../../lib/supabase-server'
import RsvpPortalView from './RsvpPortalView'

interface Props {
  params: Promise<{ pageId: string }>
}

export const revalidate = 0

export default async function PortalRsvpPage({ params }: Props) {
  const { pageId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: page } = await supabase
    .from('pages')
    .select('id, title, user_id')
    .eq('id', pageId)
    .maybeSingle()

  if (!page) notFound()
  if (page.user_id !== user.id) redirect('/portal/pages')

  const { data: raw } = await supabase
    .from('rsvp_responses')
    .select('id, name, status, guest_count, phone, email, message, created_at')
    .eq('page_id', pageId)
    .order('created_at', { ascending: false })

  const rsvps = (raw ?? []).map((r) => ({
    id: r.id,
    name: r.name,
    status: r.status as 'attending' | 'not_attending' | 'maybe',
    guest_count: r.guest_count,
    phone: r.phone,
    email: r.email,
    message: r.message,
    created_at: r.created_at,
  }))

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="px-6 md:px-8 pt-6 md:pt-8">
        <Link
          href="/portal/pages"
          className="inline-flex items-center gap-2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          My Pages
        </Link>
      </div>
      <RsvpPortalView rsvps={rsvps} pageTitle={page.title} />
    </div>
  )
}
