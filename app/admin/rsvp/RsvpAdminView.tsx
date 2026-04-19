'use client'

import { useState, useMemo } from 'react'

type RsvpRow = {
  id: string
  page_id: string
  pageTitle: string
  name: string
  status: 'attending' | 'not_attending' | 'maybe'
  guest_count: number
  phone: string | null
  email: string | null
  message: string | null
  created_at: string
}

type PageOption = { id: string; title: string }

const STATUS_LABEL: Record<string, string> = {
  attending: 'Attending',
  not_attending: 'Not Attending',
  maybe: 'Maybe',
}

const STATUS_COLOR: Record<string, string> = {
  attending: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  not_attending: 'bg-red-500/10 text-red-400 border-red-500/20',
  maybe: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
}

function exportCsv(rows: RsvpRow[], filename: string) {
  const headers = ['Page', 'Guest Name', 'Status', 'Guests', 'Phone', 'Email', 'Message', 'Date']
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
        `"${r.pageTitle.replace(/"/g, '""')}"`,
        `"${r.name.replace(/"/g, '""')}"`,
        STATUS_LABEL[r.status] ?? r.status,
        r.guest_count,
        r.phone ?? '',
        r.email ?? '',
        `"${(r.message ?? '').replace(/"/g, '""')}"`,
        new Date(r.created_at).toLocaleDateString('en-GB'),
      ].join(',')
    ),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export default function RsvpAdminView({
  rsvps,
  pages,
}: {
  rsvps: RsvpRow[]
  pages: PageOption[]
}) {
  const [selectedPage, setSelectedPage] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filtered = useMemo(() => {
    return rsvps.filter((r) => {
      const matchPage = selectedPage === 'all' || r.page_id === selectedPage
      const matchStatus = selectedStatus === 'all' || r.status === selectedStatus
      return matchPage && matchStatus
    })
  }, [rsvps, selectedPage, selectedStatus])

  const stats = useMemo(() => {
    const source = selectedPage === 'all' ? rsvps : rsvps.filter((r) => r.page_id === selectedPage)
    return {
      total: source.length,
      attending: source.filter((r) => r.status === 'attending').reduce((s, r) => s + r.guest_count, 0),
      notAttending: source.filter((r) => r.status === 'not_attending').length,
      maybe: source.filter((r) => r.status === 'maybe').length,
    }
  }, [rsvps, selectedPage])

  const pageBadges = useMemo(() => {
    return pages.map((p) => {
      const pr = rsvps.filter((r) => r.page_id === p.id)
      const responses = pr.length
      const guests = pr.filter((r) => r.status === 'attending').reduce((s, r) => s + r.guest_count, 0)
      return { ...p, responses, guests }
    })
  }, [rsvps, pages])

  const exportFilename = selectedPage === 'all'
    ? 'rsvps-all.csv'
    : `rsvps-${pages.find((p) => p.id === selectedPage)?.title ?? selectedPage}.csv`

  return (
    <div className="p-6 md:p-8 max-w-7xl">
      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">RSVPs</p>
          <h1 className="text-2xl font-light text-[var(--text)]">Guest Responses</h1>
        </div>
        <button
          onClick={() => exportCsv(filtered, exportFilename)}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-5 py-2.5 text-xs font-medium tracking-widest uppercase text-[var(--text)] transition-all hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: 'Responses', value: stats.total },
          { label: 'Attending guests', value: stats.attending },
          { label: 'Not attending', value: stats.notAttending },
          { label: 'Maybe', value: stats.maybe },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4">
            <p className="text-2xl font-light text-[var(--text)] mb-1">{value}</p>
            <p className="text-xs text-[var(--text-muted)] tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      {pageBadges.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {pageBadges.map((p) => (
            <div
              key={p.id}
              className="text-xs text-[var(--text-muted)] bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-1.5"
            >
              <span className="text-[var(--text)]">{p.title}</span>
              <span className="mx-1.5 text-[var(--border-hover)]">—</span>
              {p.responses} {p.responses === 1 ? 'response' : 'responses'}, {p.guests} {p.guests === 1 ? 'guest' : 'guests'}
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedPage}
          onChange={(e) => setSelectedPage(e.target.value)}
          className="bg-[var(--surface)] border border-[var(--border)] rounded-lg px-3 py-2 text-xs text-[var(--text)] outline-none"
        >
          <option value="all">All pages</option>
          {pages.map((p) => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <div className="flex gap-1">
          {(['all', 'attending', 'not_attending', 'maybe'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSelectedStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs transition-colors ${
                selectedStatus === s
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--surface-3)]'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">No responses yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Page', 'Guest', 'Status', 'Guests', 'Phone', 'Email', 'Message', 'Date'].map((h) => (
                  <th
                    key={h}
                    className="px-4 py-3 text-left text-[10px] tracking-widest uppercase text-[var(--text-muted)] font-medium whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--surface)] transition-colors">
                  <td className="px-4 py-3 text-[var(--text)] max-w-[180px] truncate">{r.pageTitle}</td>
                  <td className="px-4 py-3 text-[var(--text)] font-medium whitespace-nowrap">{r.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] tracking-widest uppercase font-medium ${STATUS_COLOR[r.status] ?? ''}`}>
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-secondary)] text-center">{r.guest_count}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{r.phone ?? '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">{r.email ?? '—'}</td>
                  <td className="px-4 py-3 text-[var(--text-muted)] max-w-[200px]">
                    <span className="truncate block" title={r.message ?? ''}>{r.message ?? '—'}</span>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)] whitespace-nowrap">
                    {new Date(r.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
