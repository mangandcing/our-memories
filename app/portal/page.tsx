import { Suspense } from 'react'
import Link from 'next/link'
import { createClient } from '../lib/supabase-server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const name = user?.user_metadata?.full_name ?? user?.email ?? 'there'

  return (
    <div className="p-6 md:p-8 max-w-5xl">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">
          Customer Portal
        </p>
        <h1 className="text-2xl font-light text-[var(--text)]">
          Welcome back, <span className="text-[var(--gold)]">{name}</span>
        </h1>
      </div>

      <Suspense fallback={<StatsSkeleton />}>
        <StatsSection userId={user!.id} />
      </Suspense>

      <Suspense fallback={<OrdersSkeleton />}>
        <RecentOrdersSection userId={user!.id} />
      </Suspense>

      <Link
        href="/portal/order/new"
        className="inline-flex items-center gap-2 mt-2 rounded-full border border-[var(--gold)]/40 px-6 py-2.5 text-xs font-medium tracking-widest uppercase text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Create New Page
      </Link>
    </div>
  )
}

async function StatsSection({ userId }: { userId: string }) {
  const supabase = await createClient()

  const [
    { count: totalPages },
    { count: activePages },
    { count: totalOrders },
  ] = await Promise.all([
    supabase.from('pages').select('*', { count: 'exact', head: true }).eq('user_id', userId),
    supabase.from('pages').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('status', 'active'),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('user_id', userId),
  ])

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
      <StatCard label="Total Pages" value={totalPages ?? 0} />
      <StatCard label="Active Pages" value={activePages ?? 0} />
      <StatCard label="Total Orders" value={totalOrders ?? 0} />
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5">
      <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-2">{label}</p>
      <p className="text-2xl md:text-3xl font-light text-[var(--text)]">{value}</p>
    </div>
  )
}

async function RecentOrdersSection({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from('orders')
    .select('id, amount, currency, status, created_at, tiers(name)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-medium text-[var(--text)] tracking-wide">Recent Orders</h2>
        <Link
          href="/portal/pages"
          className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
        >
          View all pages →
        </Link>
      </div>

      {!orders || orders.length === 0 ? (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-8 text-center">
          <p className="text-sm text-[var(--text-muted)]">No orders yet.</p>
          <p className="text-xs text-[var(--text-muted)]/60 mt-1">Create your first page to get started.</p>
        </div>
      ) : (
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-4 px-5 py-3 border-b border-[var(--border)]">
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Tier</p>
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Status</p>
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)]">Date</p>
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] text-right">Amount</p>
          </div>
          {orders.map((order, i) => {
            const tier = order.tiers as unknown as { name: string } | null
            return (
              <div
                key={order.id}
                className={`grid grid-cols-2 md:grid-cols-4 px-5 py-3.5 gap-y-1 ${
                  i < orders.length - 1 ? 'border-b border-[var(--border)]' : ''
                }`}
              >
                <p className="text-sm text-[var(--text)]">{tier?.name ?? '—'}</p>
                <div className="md:col-span-1 flex justify-end md:justify-start">
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-xs text-[var(--text-muted)] col-span-2 md:col-span-1">
                  {new Date(order.created_at).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </p>
                <p className="text-sm text-[var(--text)] md:text-right">
                  {Number(order.amount).toLocaleString()} {order.currency}
                </p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
  }
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] tracking-widest uppercase font-medium ${
        styles[status] ?? 'bg-[var(--border)] text-[var(--text-muted)] border-[var(--border-hover)]'
      }`}
    >
      {status}
    </span>
  )
}

function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4 mb-8">
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-4 md:p-5 animate-pulse">
          <div className="h-2.5 w-20 bg-[var(--border)] rounded mb-3" />
          <div className="h-8 w-12 bg-[var(--border)] rounded" />
        </div>
      ))}
    </div>
  )
}

function OrdersSkeleton() {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-28 bg-[var(--border)] rounded animate-pulse" />
        <div className="h-4 w-24 bg-[var(--border)] rounded animate-pulse" />
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden animate-pulse">
        {[0, 1, 2].map((i) => (
          <div key={i} className={`px-5 py-4 flex gap-4 ${i < 2 ? 'border-b border-[var(--border)]' : ''}`}>
            <div className="h-4 w-16 bg-[var(--border)] rounded" />
            <div className="h-4 w-16 bg-[var(--border)] rounded" />
            <div className="h-4 w-24 bg-[var(--border)] rounded" />
            <div className="h-4 w-20 bg-[var(--border)] rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  )
}
