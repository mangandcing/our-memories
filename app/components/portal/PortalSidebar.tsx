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

function IconPages() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  )
}

function IconNewOrder() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="16" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function IconProfile() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
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
  { href: '/portal', label: 'Dashboard', icon: <IconDashboard />, exact: true },
  { href: '/portal/pages', label: 'My Pages', icon: <IconPages />, exact: false },
  { href: '/portal/order/new', label: 'New Order', icon: <IconNewOrder />, exact: false },
  { href: '/portal/profile', label: 'My Profile', icon: <IconProfile />, exact: false },
]

export default function PortalSidebar({ profile }: { profile: Profile }) {
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
          <p className="text-xs text-[var(--text-muted)] truncate">{profile.email}</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href)
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
              {isActive && (
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
