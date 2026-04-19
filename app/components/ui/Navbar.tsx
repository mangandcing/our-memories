"use client"

import { useEffect, useMemo, useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import type { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import ThemeToggle from "./ThemeToggle"

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      ),
    []
  )

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  const signIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-[var(--gold)]/10 transition-all duration-300"
      style={{ background: "var(--navbar-bg)", boxShadow: "var(--navbar-shadow)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm tracking-[0.25em] uppercase text-[var(--gold)] font-medium"
        >
          Our Memories
        </Link>

        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="hidden sm:block text-xs tracking-wide text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
          >
            Templates
          </Link>
          <Link
            href="/gallery"
            className="hidden sm:block text-xs tracking-wide text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
          >
            Gallery
          </Link>
          <Link
            href="/demos"
            className="hidden sm:block text-xs tracking-wide text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
          >
            Demos
          </Link>

          <ThemeToggle />

          {loading ? (
            <div className="w-8 h-8 rounded-full bg-[var(--gold)]/10 animate-pulse" />
          ) : user ? (
            <>
              <Link href="/portal" className="flex items-center gap-2.5">
                {user.user_metadata?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.full_name ?? ""}
                    width={32}
                    height={32}
                    className="rounded-full ring-1 ring-[var(--gold)]/30"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-xs text-[var(--gold)]">
                    {(user.user_metadata?.full_name ?? user.email ?? "U")[0].toUpperCase()}
                  </div>
                )}
                <span className="hidden sm:block text-sm text-[var(--text)]">
                  {user.user_metadata?.full_name ?? user.email}
                </span>
              </Link>
              <button
                onClick={signOut}
                className="text-xs tracking-wide text-[var(--text-muted)] hover:text-[var(--gold)] transition-colors"
              >
                Sign out
              </button>
            </>
          ) : (
            <button
              onClick={signIn}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--gold)]/40 px-5 py-2 text-xs font-medium tracking-wide text-[var(--text)] transition-all duration-300 hover:border-[var(--gold)]/70 hover:bg-[var(--gold)]/5"
            >
              <GoogleIcon />
              Sign in with Google
            </button>
          )}
        </div>
      </div>
    </nav>
  )
}

function GoogleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
