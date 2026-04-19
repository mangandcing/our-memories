'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import OrderDetailPanel, { AdminOrder } from './OrderDetailPanel'

const STATUSES = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
]

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

function formatMMK(amount: number) {
  return `${amount.toLocaleString()} MMK`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'short', year: 'numeric',
  })
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [activeStatus, setActiveStatus] = useState('all')
  const [selected, setSelected] = useState<AdminOrder | null>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const fetchOrders = async () => {
    setLoading(true)
    let query = supabase
      .from('orders')
      .select(`
        id, amount, currency, payment_method, status, admin_note,
        screenshot_url, created_at, reviewed_at,
        users!orders_user_id_fkey (full_name, email),
        tiers!orders_tier_id_fkey (name),
        duration_prices!orders_duration_price_id_fkey (duration_months, label),
        pages!orders_page_id_fkey (id, title, slug, status, content, is_published)
      `)
      .order('created_at', { ascending: false })

    if (activeStatus !== 'all') {
      query = query.eq('status', activeStatus)
    }

    const { data } = await query
    setOrders((data as unknown as AdminOrder[]) ?? [])
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()
  }, [activeStatus])

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Orders</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">Review and approve customer payments</p>
      </div>

      <div className="flex gap-1 mb-5 bg-[var(--surface)] p-1 rounded-lg border border-[var(--border)] w-fit">
        {STATUSES.map((s) => (
          <button
            key={s.value}
            onClick={() => setActiveStatus(s.value)}
            className={`px-4 min-h-[44px] flex items-center rounded-md text-sm transition-colors ${
              activeStatus === s.value
                ? 'bg-[var(--border)] text-[var(--text)]'
                : 'text-[var(--text-muted)] hover:text-[var(--text)]'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-5 h-5 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <p className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">No orders found</p>
        ) : (
          <>
            <div className="md:hidden divide-y divide-[var(--surface-3)]">
              {orders.map((order) => (
                <div
                  key={order.id}
                  className="p-4 cursor-pointer hover:bg-[var(--surface-2)] transition-colors"
                  onClick={() => setSelected(order)}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--text)] truncate">{order.users?.full_name ?? '—'}</p>
                      <p className="text-xs text-[var(--text-muted)] truncate">{order.users?.email}</p>
                    </div>
                    <StatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="text-[var(--text-muted)]">{order.tiers?.name ?? '—'}</span>
                      <span className="text-[var(--gold)] font-medium">{formatMMK(Number(order.amount))}</span>
                      <span className="text-[var(--text-muted)]">{formatDate(order.created_at)}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelected(order) }}
                      className="min-h-[44px] px-3 flex items-center text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
                    >
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Customer', 'Tier', 'Amount', 'Method', 'Status', 'Date', ''].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs text-[var(--text-muted)] font-medium whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-[var(--surface-3)] last:border-0 hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
                      onClick={() => setSelected(order)}
                    >
                      <td className="px-5 py-3.5">
                        <p className="text-[var(--text)] font-medium">{order.users?.full_name ?? '—'}</p>
                        <p className="text-xs text-[var(--text-muted)]">{order.users?.email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-[var(--text)] whitespace-nowrap">{order.tiers?.name ?? '—'}</td>
                      <td className="px-5 py-3.5 text-[var(--gold)] font-medium whitespace-nowrap">{formatMMK(Number(order.amount))}</td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)] capitalize whitespace-nowrap">
                        {order.payment_method?.replace(/_/g, ' ')}
                      </td>
                      <td className="px-5 py-3.5 whitespace-nowrap"><StatusBadge status={order.status} /></td>
                      <td className="px-5 py-3.5 text-[var(--text-muted)] whitespace-nowrap">{formatDate(order.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={(e) => { e.stopPropagation(); setSelected(order) }}
                          className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors whitespace-nowrap"
                        >
                          Review
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>

      {selected && (
        <OrderDetailPanel
          order={selected}
          onClose={() => { setSelected(null); fetchOrders() }}
        />
      )}
    </div>
  )
}
