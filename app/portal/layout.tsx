import { redirect } from 'next/navigation'
import { createClient } from '../lib/supabase-server'
import PortalSidebar from '../components/portal/PortalSidebar'
import PortalBottomNav from '../components/portal/PortalBottomNav'

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const profile = {
    name: user.user_metadata?.full_name ?? user.email ?? 'User',
    email: user.email ?? '',
    avatarUrl: (user.user_metadata?.avatar_url as string) ?? null,
  }

  return (
    <div className="min-h-screen bg-[var(--bg)] transition-colors duration-300">
      <PortalSidebar profile={profile} />
      <PortalBottomNav />
      <main className="md:pl-64 pb-20 md:pb-0 min-h-screen">
        {children}
      </main>
    </div>
  )
}
