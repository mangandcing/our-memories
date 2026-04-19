'use client'

import { useState, useEffect, useTransition } from 'react'
import { approveOrder, approveAndPublishOrder, rejectOrder, getScreenshotSignedUrl } from './actions'

export type AdminOrder = {
  id: string
  amount: number
  currency: string
  payment_method: string
  status: string
  admin_note: string | null
  screenshot_url: string
  created_at: string
  reviewed_at: string | null
  users: { full_name: string | null; email: string | null } | null
  tiers: { name: string } | null
  pages: {
    id: string
    title: string
    slug: string
    status: string
    content: Record<string, unknown>
    is_published: boolean
  } | null
  duration_prices: { duration_months: number; label: string } | null
}

function formatMMK(amount: number) {
  return `${amount.toLocaleString()} MMK`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-400',
    awaiting_payment: 'bg-amber-500/15 text-amber-400',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${map[status] ?? 'bg-slate-500/15 text-slate-400'}`}>
      {status.replace(/_/g, ' ')}
    </span>
  )
}

function IconX() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )
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

export default function OrderDetailPanel({
  order,
  onClose,
}: {
  order: AdminOrder
  onClose: () => void
}) {
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [result, setResult] = useState<{ error?: string; success?: boolean } | null>(null)
  const [signedUrl, setSignedUrl] = useState<string | null>(null)
  const [screenshotLoading, setScreenshotLoading] = useState(true)

  useEffect(() => {
    setScreenshotLoading(true)
    setSignedUrl(null)
    getScreenshotSignedUrl(order.screenshot_url).then(({ signedUrl }) => {
      setSignedUrl(signedUrl ?? null)
      setScreenshotLoading(false)
    })
  }, [order.screenshot_url])

  const pageReady =
    order.pages?.status === 'draft' &&
    !order.pages?.is_published &&
    Object.keys(order.pages?.content ?? {}).length > 0

  const isPendingStatus = order.status === 'pending' || order.status === 'awaiting_payment'

  const handleApprove = () => {
    startTransition(async () => {
      const res = await approveOrder(order.id)
      setResult(res)
    })
  }

  const handleApproveAndPublish = () => {
    if (!order.pages?.id) return
    startTransition(async () => {
      const res = await approveAndPublishOrder(order.id, order.pages!.id)
      setResult(res)
    })
  }

  const handleReject = () => {
    if (!rejectReason.trim()) return
    startTransition(async () => {
      const res = await rejectOrder(order.id, rejectReason.trim())
      setResult(res)
    })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <aside className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--surface-alt)] border-l border-[var(--border)] z-50 overflow-y-auto flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] sticky top-0 bg-[var(--surface-alt)]">
          <h2 className="text-sm font-medium text-[var(--text)]">Order Detail</h2>
          <button onClick={onClose} className="text-[var(--text-muted)] hover:text-[var(--text)] transition-colors">
            <IconX />
          </button>
        </div>

        <div className="flex-1 p-5 space-y-5">
          <div className="flex items-center justify-between">
            <StatusBadge status={order.status} />
            <span className="text-xs text-[var(--text-muted)]">{formatDate(order.created_at)}</span>
          </div>

          <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] divide-y divide-[var(--border)]">
            <div className="px-4 py-3">
              <p className="text-xs text-[var(--text-muted)] mb-0.5">Customer</p>
              <p className="text-sm text-[var(--text)] font-medium">{order.users?.full_name ?? '—'}</p>
              <p className="text-xs text-[var(--text-muted)]">{order.users?.email}</p>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Tier</p>
                <p className="text-sm text-[var(--text)]">{order.tiers?.name ?? '—'}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Duration</p>
                <p className="text-sm text-[var(--text)]">{order.duration_prices?.label ?? 'Lifetime'}</p>
              </div>
            </div>
            <div className="px-4 py-3 grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Amount</p>
                <p className="text-sm text-[var(--gold)] font-semibold">{formatMMK(Number(order.amount))}</p>
              </div>
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Payment Method</p>
                <p className="text-sm text-[var(--text)] capitalize">{order.payment_method?.replace(/_/g, ' ')}</p>
              </div>
            </div>
            {order.pages && (
              <div className="px-4 py-3">
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Page</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm text-[var(--text)]">{order.pages.title}</p>
                  <a
                    href={`/portal/preview/${order.pages.slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
                  >
                    <IconExternal />
                  </a>
                </div>
                <p className="text-xs text-[var(--text-muted)] mt-0.5 capitalize">
                  Page status: {order.pages.status}
                  {order.pages.is_published && ' · published'}
                </p>
              </div>
            )}
          </div>

          <div className="bg-[var(--surface)] rounded-lg border border-[var(--border)] p-4">
            <p className="text-xs text-[var(--text-muted)] mb-3">Payment Screenshot</p>
            {screenshotLoading ? (
              <div className="flex items-center justify-center h-32 rounded border border-[var(--border)]">
                <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
              </div>
            ) : signedUrl ? (
              <a href={signedUrl} target="_blank" rel="noopener noreferrer" className="block">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={signedUrl}
                  alt="Payment screenshot"
                  className="w-full rounded border border-[var(--border)] object-contain max-h-64"
                />
                <p className="mt-2 text-xs text-[var(--gold)] flex items-center gap-1 hover:text-[var(--gold-light)] transition-colors">
                  <IconExternal />
                  Open full size
                </p>
              </a>
            ) : (
              <p className="text-xs text-[var(--text-muted)]">Screenshot unavailable</p>
            )}
          </div>

          {order.admin_note && (
            <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              <p className="text-xs text-[var(--text-muted)] mb-1">Admin Note</p>
              <p className="text-sm text-[var(--text)]">{order.admin_note}</p>
            </div>
          )}

          {result?.error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-sm text-red-400">
              {result.error}
            </div>
          )}
          {result?.success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm text-green-400">
              Done. Close and reload to see the updated status.
            </div>
          )}

          {isPendingStatus && !result?.success && (
            <div className="space-y-3">
              {pageReady ? (
                <div className="space-y-2">
                  <button
                    onClick={handleApproveAndPublish}
                    disabled={isPending}
                    className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                  >
                    {isPending ? 'Processing…' : 'Approve & Publish Now'}
                  </button>
                  <button
                    onClick={handleApprove}
                    disabled={isPending}
                    className="w-full py-2.5 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border-hover)] disabled:opacity-50 text-green-400 border border-green-500/20 text-sm transition-colors"
                  >
                    Approve Payment Only
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleApprove}
                  disabled={isPending}
                  className="w-full py-2.5 rounded-lg bg-green-600 hover:bg-green-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                >
                  {isPending ? 'Processing…' : 'Approve Payment'}
                </button>
              )}

              {!showRejectForm ? (
                <button
                  onClick={() => setShowRejectForm(true)}
                  disabled={isPending}
                  className="w-full py-2.5 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border-hover)] disabled:opacity-50 text-red-400 border border-red-500/20 text-sm transition-colors"
                >
                  Reject
                </button>
              ) : (
                <div className="space-y-2">
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Reason for rejection…"
                    rows={3}
                    className="w-full px-3 py-2 rounded-lg bg-[var(--surface)] border border-[var(--border-hover)] text-base text-[var(--text)] placeholder:text-[var(--text-dim)] focus:outline-none focus:border-red-500/40 resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleReject}
                      disabled={isPending || !rejectReason.trim()}
                      className="flex-1 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white text-sm font-medium transition-colors"
                    >
                      {isPending ? 'Rejecting…' : 'Confirm Reject'}
                    </button>
                    <button
                      onClick={() => { setShowRejectForm(false); setRejectReason('') }}
                      className="px-4 py-2.5 rounded-lg bg-[var(--surface-3)] hover:bg-[var(--border-hover)] text-[var(--text-muted)] text-sm transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
