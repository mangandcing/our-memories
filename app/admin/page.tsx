import { createAdminClient } from '../lib/supabase-admin'
import { getQuickStats } from './actions'
import QuickActions from './QuickActions'
import Link from 'next/link'

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    pending: 'bg-amber-500/15 text-amber-400',
    awaiting_payment: 'bg-amber-500/15 text-amber-400',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
    active: 'bg-blue-500/15 text-blue-400',
    draft: 'bg-slate-500/15 text-slate-400',
    expired: 'bg-red-500/15 text-red-400',
  }
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${map[status] ?? 'bg-slate-500/15 text-slate-400'}`}>
      {status.replace('_', ' ')}
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

export default async function AdminDashboardPage() {
  const supabase = createAdminClient()

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: activePages },
    { data: revenueRows },
    { data: recentOrders },
    quickStats,
  ] = await Promise.all([
    supabase.from('orders').select('id', { count: 'exact', head: true }),
    supabase.from('orders').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('pages').select('id', { count: 'exact', head: true }).eq('status', 'active'),
    supabase.from('orders').select('amount').eq('status', 'approved'),
    supabase
      .from('orders')
      .select(`
        id, amount, payment_method, status, created_at,
        users!orders_user_id_fkey (full_name, email),
        tiers!orders_tier_id_fkey (name)
      `)
      .order('created_at', { ascending: false })
      .limit(10),
    getQuickStats(),
  ])

  const totalRevenue = (revenueRows ?? []).reduce((sum, r) => sum + Number(r.amount), 0)

  const telegramConfigured = !!(process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_CHAT_ID)

  const stats = [
    { label: 'Total Orders', value: totalOrders ?? 0, color: 'text-[var(--text)]' },
    { label: 'Pending Review', value: pendingOrders ?? 0, color: 'text-amber-400' },
    { label: 'Total Revenue', value: formatMMK(totalRevenue), color: 'text-[var(--gold)]' },
    { label: 'Active Pages', value: activePages ?? 0, color: 'text-blue-400' },
  ]

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--text)]">Dashboard</h1>
          <p className="text-sm text-[var(--text-muted)] mt-0.5">Our Memories admin portal</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs border ${
          telegramConfigured
            ? 'border-green-500/20 bg-green-500/5 text-green-400'
            : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${telegramConfigured ? 'bg-green-400' : 'bg-[var(--text-dim)]'}`} />
          Telegram {telegramConfigured ? 'connected' : 'not configured'}
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-5">
            <p className="text-xs text-[var(--text-muted)] mb-1">{s.label}</p>
            <p className={`text-2xl font-semibold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mb-6">
        <QuickActions initial={quickStats} />
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <h2 className="text-sm font-medium text-[var(--text)]">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
          >
            View all
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Customer', 'Tier', 'Amount', 'Method', 'Status', 'Date'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-[var(--text-muted)] font-medium">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(recentOrders ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-[var(--text-muted)]">
                    No orders yet
                  </td>
                </tr>
              ) : (
                (recentOrders ?? []).map((order: any) => (
                  <tr key={order.id} className="border-b border-[var(--surface-3)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-[var(--text)] font-medium">{order.users?.full_name ?? '—'}</p>
                      <p className="text-xs text-[var(--text-muted)]">{order.users?.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-[var(--text)]">{order.tiers?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[var(--gold)] font-medium">{formatMMK(Number(order.amount))}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] capitalize">{order.payment_method?.replace('_', ' ')}</td>
                    <td className="px-5 py-3.5"><StatusBadge status={order.status} /></td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)]">{formatDate(order.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
