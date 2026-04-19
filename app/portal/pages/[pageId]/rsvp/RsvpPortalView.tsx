'use client'

import { useState, useMemo } from 'react'

type RsvpRow = {
  id: string
  name: string
  status: 'attending' | 'not_attending' | 'maybe'
  guest_count: number
  phone: string | null
  email: string | null
  message: string | null
  created_at: string
}

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

function exportCsv(rows: RsvpRow[], pageTitle: string) {
  const headers = ['Guest Name', 'Status', 'Guests', 'Phone', 'Email', 'Message', 'Date']
  const lines = [
    headers.join(','),
    ...rows.map((r) =>
      [
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
  a.download = `rsvps-${pageTitle}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function RsvpPortalView({
  rsvps,
  pageTitle,
}: {
  rsvps: RsvpRow[]
  pageTitle: string
}) {
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const filtered = useMemo(() => {
    return selectedStatus === 'all' ? rsvps : rsvps.filter((r) => r.status === selectedStatus)
  }, [rsvps, selectedStatus])

  const stats = useMemo(() => ({
    total: rsvps.length,
    attending: rsvps.filter((r) => r.status === 'attending').reduce((s, r) => s + r.guest_count, 0),
    notAttending: rsvps.filter((r) => r.status === 'not_attending').length,
    maybe: rsvps.filter((r) => r.status === 'maybe').length,
  }), [rsvps])

  return (
    <div className="p-6 md:p-8 max-w-6xl">
      <div className="flex items-start justify-between mb-2 gap-4 flex-wrap">
        <div>
          <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">RSVPs</p>
          <h1 className="text-2xl font-light text-[var(--text)]">{pageTitle}</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">
            {stats.total} {stats.total === 1 ? 'response' : 'responses'}, {stats.attending} {stats.attending === 1 ? 'guest' : 'guests'} attending
          </p>
        </div>
        <button
          onClick={() => exportCsv(filtered, pageTitle)}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 mb-8">
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

      <div className="flex gap-1 mb-6">
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

      {filtered.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-sm text-[var(--text-muted)]">
            {rsvps.length === 0 ? 'No responses yet.' : 'No responses match this filter.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-[var(--border)]">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Guest', 'Status', 'Guests', 'Phone', 'Email', 'Message', 'Date'].map((h) => (
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
