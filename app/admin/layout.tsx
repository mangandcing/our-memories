import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase-server'
import { createAdminClient } from '../lib/supabase-admin'
import AdminSidebar from '../components/admin/AdminSidebar'
import AdminBottomNav from '../components/admin/AdminBottomNav'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const adminEmails = (process.env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)

  if (!adminEmails.includes(user.email ?? '')) redirect('/')

  const adminSupabase = createAdminClient()
  const { count: pendingCount } = await adminSupabase
    .from('orders')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'pending')

  const profile = {
    name: user.user_metadata?.full_name ?? user.email ?? 'Admin',
    email: user.email ?? '',
    avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <AdminSidebar profile={profile} pendingCount={pendingCount ?? 0} />
      <AdminBottomNav />
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
