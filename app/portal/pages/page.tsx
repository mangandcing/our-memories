import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-server'
import ShareButton from './CopyLinkButton'

export default async function MyPagesPage() {
  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">
            My Pages
          </p>
          <h1 className="text-2xl font-light text-[var(--text)]">Your Pages</h1>
        </div>
        <Link
          href="/portal/order/new"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New Page
        </Link>
      </div>

      <Suspense fallback={<PagesSkeleton />}>
        <PagesGrid />
      </Suspense>
    </div>
  )
}

async function PagesGrid() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: pages } = await supabase
    .from('pages')
    .select('id, title, slug, status, created_at, templates(name), tiers(name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  if (!pages || pages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-5">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <p className="text-base font-light text-[var(--text)] mb-2">No pages yet</p>
        <p className="text-sm text-[var(--text-muted)] mb-6 max-w-xs">
          Create your first celebration page and share your special moment with the world.
        </p>
        <Link
          href="/portal/order/new"
          className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-6 py-2.5 text-xs font-medium tracking-widest uppercase text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Create First Page
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {pages.map((page) => {
        const template = page.templates as unknown as { name: string } | null
        const tier = page.tiers as unknown as { name: string } | null
        return (
          <div key={page.id} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 flex flex-col gap-4 hover:border-[var(--border-hover)] transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-sm font-medium text-[var(--text)] truncate mb-1">
                  {page.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] truncate">
                  {template?.name ?? 'No template'}
                </p>
              </div>
              <PageStatusBadge status={page.status} />
            </div>

            <div className="flex items-center gap-2">
              <TierBadge name={tier?.name ?? ''} />
              <span className="text-[10px] text-[var(--text-muted)]">
                {new Date(page.created_at).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>

            <div className="flex items-center gap-1 pt-1 border-t border-[var(--border)]">
              <Link
                href={`/${page.slug}`}
                target="_blank"
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Preview
              </Link>
              <Link
                href={`/portal/pages/${page.id}/edit`}
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
                Edit
              </Link>
              <Link
                href={`/portal/pages/${page.id}/rsvp`}
                className="flex-1 flex items-center justify-center gap-1.5 min-h-[44px] rounded-lg text-xs text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)] transition-colors"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <polyline points="16 11 18 13 22 9" />
                </svg>
                RSVPs
              </Link>
              <ShareButton slug={page.slug} title={page.title} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

function PageStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    draft: 'bg-[var(--border)] text-[var(--text-muted)] border-[var(--border-hover)]',
    active: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    expired: 'bg-red-500/10 text-red-400 border-red-500/20',
    pending_review: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  }
  return (
    <span
      className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] tracking-widest uppercase font-medium ${
        styles[status] ?? styles.draft
      }`}
    >
      {status}
    </span>
  )
}

function TierBadge({ name }: { name: string }) {
  const styles: Record<string, string> = {
    Basic: 'bg-[var(--border)] text-[var(--text-secondary)] border-[var(--border-hover)]',
    Premium: 'bg-[var(--gold)]/10 text-[var(--gold)] border-[var(--gold)]/20',
    Luxury: 'bg-white/5 text-white border-white/10',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] tracking-wider uppercase font-medium ${
        styles[name] ?? styles['Basic']
      }`}
    >
      {name || '—'}
    </span>
  )
}

function PagesSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5 animate-pulse">
          <div className="flex justify-between mb-3">
            <div>
              <div className="h-4 w-32 bg-[var(--border)] rounded mb-2" />
              <div className="h-3 w-24 bg-[var(--border)] rounded" />
            </div>
            <div className="h-5 w-14 bg-[var(--border)] rounded-full" />
          </div>
          <div className="h-3 w-20 bg-[var(--border)] rounded mb-4" />
          <div className="flex gap-2 pt-3 border-t border-[var(--border)]">
            <div className="flex-1 h-8 bg-[var(--border)] rounded-lg" />
            <div className="flex-1 h-8 bg-[var(--border)] rounded-lg" />
            <div className="flex-1 h-8 bg-[var(--border)] rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  )
}
