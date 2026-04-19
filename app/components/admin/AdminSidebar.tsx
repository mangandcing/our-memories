'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useMemo } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import ThemeToggle from '../ui/ThemeToggle'

type Profile = {
  name: string
  email: string
  avatarUrl: string | null
}

function IconDashboard() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

function IconOrders() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  )
}

function IconPages() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  )
}

function IconTemplates() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  )
}

function IconPricing() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )
}

function IconRsvp() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <polyline points="16 11 18 13 22 9" />
    </svg>
  )
}

function IconSettings() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  )
}

function IconSignOut() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  )
}

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: <IconDashboard />, exact: true },
  { href: '/admin/orders', label: 'Orders', icon: <IconOrders />, exact: false },
  { href: '/admin/pages', label: 'Pages', icon: <IconPages />, exact: false },
  { href: '/admin/rsvp', label: 'RSVPs', icon: <IconRsvp />, exact: false },
  { href: '/admin/templates', label: 'Templates', icon: <IconTemplates />, exact: false },
  { href: '/admin/pricing', label: 'Pricing', icon: <IconPricing />, exact: false },
  { href: '/admin/settings', label: 'Settings', icon: <IconSettings />, exact: false },
]

export default function AdminSidebar({
  profile,
  pendingCount,
}: {
  profile: Profile
  pendingCount: number
}) {
  const pathname = usePathname()
  const router = useRouter()

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <aside className="hidden md:flex fixed top-0 left-0 h-screen w-64 flex-col bg-[var(--surface-alt)] border-r border-[var(--border)] z-40 transition-colors duration-300">
      <div className="px-6 py-5 border-b border-[var(--border)]">
        <Link
          href="/"
          className="text-xs tracking-[0.25em] uppercase text-[var(--gold)] font-medium hover:text-[var(--gold-light)] transition-colors"
        >
          Our Memories
        </Link>
      </div>

      <div className="px-5 py-4 border-b border-[var(--border)] flex items-center gap-3">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatarUrl}
            alt={profile.name}
            width={36}
            height={36}
            className="rounded-full ring-1 ring-[var(--gold)]/30 shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-sm text-[var(--gold)] shrink-0">
            {profile.name[0].toUpperCase()}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-sm text-[var(--text)] truncate font-medium">{profile.name}</p>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase bg-[var(--gold)]/15 text-[var(--gold)]">
            Admin
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
          const showBadge = item.href === '/admin/orders' && pendingCount > 0
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? 'bg-[var(--gold)]/10 text-[var(--gold)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)]'
              }`}
            >
              <span className="shrink-0">{item.icon}</span>
              {item.label}
              {showBadge && (
                <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-semibold flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
              {isActive && !showBadge && (
                <span className="ml-auto w-1 h-4 rounded-full bg-[var(--gold)]" />
              )}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--border)] space-y-1">
        <div className="flex items-center gap-3 px-3 py-2">
          <ThemeToggle compact />
          <span className="text-xs text-[var(--text-muted)]">Appearance</span>
        </div>
        <button
          onClick={signOut}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text)] hover:bg-[var(--border)] transition-colors"
        >
          <span className="shrink-0">
            <IconSignOut />
          </span>
          Sign out
        </button>
      </div>
    </aside>
  )
}
