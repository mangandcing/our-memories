'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import { getQuickStats } from './actions'

type Stats = {
  pendingOrders: number
  pagesWaiting: number
}

function IconClock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  )
}

function IconRefresh({ spinning }: { spinning: boolean }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={spinning ? 'animate-spin' : ''}
    >
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  )
}

export default function QuickActions({ initial }: { initial: Stats }) {
  const [stats, setStats] = useState<Stats>(initial)
  const [isPending, startTransition] = useTransition()
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date())

  const refresh = () => {
    startTransition(async () => {
      const fresh = await getQuickStats()
      setStats(fresh)
      setLastRefreshed(new Date())
    })
  }

  useEffect(() => {
    const id = setInterval(refresh, 60_000)
    return () => clearInterval(id)
  }, [])

  const timeAgo = Math.round((Date.now() - lastRefreshed.getTime()) / 1000)
  const timeLabel = timeAgo < 5 ? 'just now' : `${timeAgo}s ago`

  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--text)]">Quick Actions</h2>
        <button
          onClick={refresh}
          disabled={isPending}
          className="flex items-center gap-1.5 text-[10px] text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
        >
          <IconRefresh spinning={isPending} />
          {isPending ? 'Refreshing…' : `Updated ${timeLabel}`}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/admin/orders?status=pending"
          className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] hover:border-amber-500/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400">
              <IconClock />
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Pending Payments</p>
              <p className="text-xl font-semibold text-amber-400 leading-tight">
                {stats.pendingOrders}
              </p>
            </div>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--text-dim)] group-hover:text-amber-400 transition-colors"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>

        <Link
          href="/admin/pages"
          className="flex items-center justify-between p-4 rounded-lg bg-[var(--surface-alt)] border border-[var(--border)] hover:border-[var(--gold)]/30 transition-colors group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div>
              <p className="text-xs text-[var(--text-muted)]">Pages to Publish</p>
              <p className="text-xl font-semibold text-[var(--gold)] leading-tight">
                {stats.pagesWaiting}
              </p>
            </div>
          </div>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-[var(--text-dim)] group-hover:text-[var(--gold)] transition-colors"
          >
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </div>
  )
}
