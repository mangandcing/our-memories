'use client'

import { useState, useEffect, useTransition } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { publishPage, unpublishPage, adminToggleGallery } from './actions'
import Link from 'next/link'

type AdminPage = {
  id: string
  title: string
  slug: string
  status: string
  is_published: boolean
  show_in_gallery: boolean
  created_at: string
  expires_at: string | null
  users: { full_name: string | null; email: string | null } | null
  tiers: { name: string } | null
  templates: { name: string } | null
  orders: Array<{
    id: string
    status: string
    duration_prices: { duration_months: number; label: string } | null
  }> | null
}

function StatusBadge({ status, isPublished }: { status: string; isPublished: boolean }) {
  if (isPublished) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-blue-500/15 text-blue-400">
        active
      </span>
    )
  }
  const map: Record<string, string> = {
    draft: 'bg-slate-500/15 text-slate-400',
    active: 'bg-blue-500/15 text-blue-400',
    expired: 'bg-red-500/15 text-red-400',
    pending_review: 'bg-amber-500/15 text-amber-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${map[status] ?? 'bg-slate-500/15 text-slate-400'}`}>
      {status}
    </span>
  )
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

function IconExternal() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function PageRow({ page, onRefresh }: { page: AdminPage; onRefresh: () => void }) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [galleryPending, setGalleryPending] = useState(false)
  const [inGallery, setInGallery] = useState(page.show_in_gallery)

  const approvedOrder = page.orders?.find((o) => o.status === 'approved')

  const handlePublish = () => {
    if (!approvedOrder) return
    setError(null)
    startTransition(async () => {
      const res = await publishPage(page.id, approvedOrder.id)
      if (res.error) setError(res.error)
      else onRefresh()
    })
  }

  const handleUnpublish = () => {
    setError(null)
    startTransition(async () => {
      const res = await unpublishPage(page.id)
      if (res.error) setError(res.error)
      else onRefresh()
    })
  }

  const actions = (
    <div className="flex items-center gap-2 flex-wrap">
      <Link
        href={`/portal/preview/${page.slug}`}
        target="_blank"
        className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors whitespace-nowrap"
      >
        Preview
      </Link>
      <Link
        href={`/admin/guest-book/${page.id}`}
        className="text-xs text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors whitespace-nowrap"
      >
        Guest Book
      </Link>
      {page.status === 'pending_review' && (
        <Link
          href={`/portal/preview/${page.slug}`}
          target="_blank"
          className="text-xs text-amber-400 hover:text-amber-300 transition-colors whitespace-nowrap"
        >
          Review Content
        </Link>
      )}
      {page.is_published ? (
        <button
          onClick={handleUnpublish}
          disabled={isPending}
          className="text-xs text-red-400 hover:text-red-300 disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isPending ? '…' : 'Unpublish'}
        </button>
      ) : approvedOrder ? (
        <button
          onClick={handlePublish}
          disabled={isPending}
          className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] disabled:opacity-50 transition-colors whitespace-nowrap"
        >
          {isPending ? '…' : 'Publish'}
        </button>
      ) : (
        <span className="text-xs text-[var(--text-dim)] whitespace-nowrap">No approved order</span>
      )}
      <button
        onClick={async () => {
          setGalleryPending(true)
          const next = !inGallery
          setInGallery(next)
          await adminToggleGallery(page.id, next)
          setGalleryPending(false)
        }}
        disabled={galleryPending}
        title={inGallery ? 'Remove from gallery' : 'Add to gallery'}
        className={`text-xs disabled:opacity-40 transition-colors whitespace-nowrap ${
          inGallery ? 'text-[var(--gold)] hover:text-red-400' : 'text-[var(--text-dim)] hover:text-[var(--gold)]'
        }`}
      >
        {inGallery ? 'In Gallery' : 'Gallery Off'}
      </button>
    </div>
  )

  return (
    <>
      {/* Mobile card */}
      <div className="md:hidden px-4 py-3 hover:bg-[var(--surface-2)] transition-colors">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-[var(--text)] truncate">{page.title}</p>
              {page.is_published && (
                <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--gold)] shrink-0">
                  <IconExternal />
                </a>
              )}
            </div>
            <p className="text-xs text-[var(--text-muted)] truncate">{page.users?.full_name ?? '—'} · {page.tiers?.name ?? '—'}</p>
          </div>
          <StatusBadge status={page.status} isPublished={page.is_published} />
        </div>
        {error && <p className="text-xs text-red-400 mb-1">{error}</p>}
        {actions}
      </div>

      {/* Desktop table row */}
      <tr className="hidden md:table-row border-b border-[var(--surface-3)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1.5">
            <p className="text-[var(--text)] font-medium">{page.title}</p>
            {page.is_published && (
              <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer" className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors">
                <IconExternal />
              </a>
            )}
          </div>
          {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
        </td>
        <td className="px-5 py-3.5">
          <p className="text-[var(--text)] text-sm">{page.users?.full_name ?? '—'}</p>
          <p className="text-xs text-[var(--text-muted)]">{page.users?.email}</p>
        </td>
        <td className="px-5 py-3.5 text-[var(--text)] whitespace-nowrap">{page.tiers?.name ?? '—'}</td>
        <td className="px-5 py-3.5 text-[var(--text-muted)] whitespace-nowrap">{page.templates?.name ?? '—'}</td>
        <td className="px-5 py-3.5 whitespace-nowrap">
          <StatusBadge status={page.status} isPublished={page.is_published} />
        </td>
        <td className="px-5 py-3.5 text-[var(--text-muted)] whitespace-nowrap">{formatDate(page.created_at)}</td>
        <td className="px-5 py-3.5">{actions}</td>
      </tr>
    </>
  )
}

export default function AdminPagesPage() {
  const [pages, setPages] = useState<AdminPage[]>([])
  const [loading, setLoading] = useState(true)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchPages = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('pages')
      .select(`
        id, title, slug, status, is_published, show_in_gallery, created_at, expires_at,
        users!pages_user_id_fkey (full_name, email),
        tiers!pages_tier_id_fkey (name),
        templates!pages_template_id_fkey (name),
        orders!orders_page_id_fkey (id, status, duration_prices!orders_duration_price_id_fkey (duration_months, label))
      `)
      .order('created_at', { ascending: false })

    setPages((data as unknown as AdminPage[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchPages()
  }, [])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Pages</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Manage and publish customer pages</p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
          </div>
        ) : pages.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">No pages yet</p>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[var(--surface-3)]">
              {pages.map((page) => (
                <PageRow key={page.id} page={page} onRefresh={fetchPages} />
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Title', 'Customer', 'Tier', 'Template', 'Status', 'Created', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-[var(--text-muted)] font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {pages.map((page) => (
                    <PageRow key={page.id} page={page} onRefresh={fetchPages} />
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
