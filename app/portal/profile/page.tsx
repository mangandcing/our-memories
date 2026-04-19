import { Suspense } from 'react'
import { createClient } from '../../lib/supabase-server'
import CopyCodeButton from './CopyCodeButton'

export default async function ProfilePage() {
  return (
    <div className="p-6 md:p-8 max-w-2xl">
      <div className="mb-8">
        <p className="text-xs tracking-[0.3em] uppercase text-[var(--gold)]/60 mb-2">My Profile</p>
        <h1 className="text-2xl font-light text-[var(--text)]">Your Account</h1>
      </div>

      <Suspense fallback={<ProfileSkeleton />}>
        <ProfileContent />
      </Suspense>
    </div>
  )
}

async function ProfileContent() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('users')
    .select('full_name, email, avatar_url, referral_code')
    .eq('id', user!.id)
    .single()

  const { data: referrals } = await supabase
    .from('referrals')
    .select('id, reward_amount, status')
    .eq('referrer_id', user!.id)

  const totalReferred = referrals?.length ?? 0
  const totalCredit = referrals
    ?.filter((r) => r.status === 'credited')
    .reduce((sum, r) => sum + (Number(r.reward_amount) || 0), 0) ?? 0

  const name = profile?.full_name ?? user?.user_metadata?.full_name ?? user?.email ?? 'User'
  const email = profile?.email ?? user?.email ?? ''
  const avatarUrl = profile?.avatar_url ?? user?.user_metadata?.avatar_url ?? null

  return (
    <div className="space-y-6">
      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-5">Identity</h2>
        <div className="flex items-center gap-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt={name}
              width={56}
              height={56}
              className="rounded-full ring-1 ring-[var(--gold)]/30 shrink-0"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-[var(--gold)]/20 flex items-center justify-center text-lg text-[var(--gold)] shrink-0">
              {name[0].toUpperCase()}
            </div>
          )}
          <div>
            <p className="text-base font-medium text-[var(--text)]">{name}</p>
            <p className="text-sm text-[var(--text-muted)] mt-0.5">{email}</p>
            <p className="text-xs text-[var(--text-dim)] mt-1.5 flex items-center gap-1.5">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" stroke="none" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" stroke="none" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" stroke="none" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" stroke="none" />
              </svg>
              Signed in with Google
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <h2 className="text-xs tracking-widest uppercase text-[var(--text-muted)] mb-5">Referral Programme</h2>
        <div className="mb-5">
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Share your referral code. When someone uses it to place an order, you earn credit.
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg px-4 py-3">
              <p className="text-sm font-mono tracking-widest text-[var(--gold)]">
                {profile?.referral_code ?? '——'}
              </p>
            </div>
            <CopyCodeButton code={profile?.referral_code ?? ''} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg p-4">
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-1.5">
              People Referred
            </p>
            <p className="text-2xl font-light text-[var(--text)]">{totalReferred}</p>
          </div>
          <div className="bg-[var(--surface-alt)] border border-[var(--border)] rounded-lg p-4">
            <p className="text-[10px] tracking-widest uppercase text-[var(--text-muted)] mb-1.5">
              Credit Earned
            </p>
            <p className="text-2xl font-light text-[var(--text)]">
              {totalCredit > 0 ? `${totalCredit.toLocaleString()} MMK` : '0 MMK'}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <div className="h-2.5 w-16 bg-[var(--border)] rounded mb-5" />
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[var(--border)] shrink-0" />
          <div>
            <div className="h-4 w-32 bg-[var(--border)] rounded mb-2" />
            <div className="h-3 w-48 bg-[var(--border)] rounded" />
          </div>
        </div>
      </div>
      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl p-6">
        <div className="h-2.5 w-24 bg-[var(--border)] rounded mb-5" />
        <div className="h-12 bg-[var(--border)] rounded-lg mb-5" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 bg-[var(--border)] rounded-lg" />
          <div className="h-20 bg-[var(--border)] rounded-lg" />
        </div>
      </div>
    </div>
  )
}
