import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '../../lib/supabase-server'
import DemoCard from './DemoCard'

export const metadata: Metadata = {
  title: 'Demos — Our Memories',
  description: 'See what Our Memories can create. Browse live demo pages for weddings, birthdays, anniversaries and more.',
}

export const revalidate = 60

const DEMO_COLORS: Record<string, { accent: string; bg: string }> = {
  'royal-wedding':     { accent: '#c9a96e', bg: '#1a0a2e' },
  'milestone-birthday':{ accent: '#d4729a', bg: '#1a0a14' },
  'garden-romance':    { accent: '#7aad8a', bg: '#0a1a10' },
  'gentle-farewell':   { accent: '#9ba8b8', bg: '#0a0f1a' },
  'eternal-devotion':  { accent: '#c96e7a', bg: '#1a0a0a' },
  'forever-and-always':{ accent: '#6ebfbf', bg: '#0a1a1a' },
}

function IconArrow() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  )
}

function EmptyState() {
  return (
    <div className="py-32 flex flex-col items-center gap-5 text-center">
      <div className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 9h18M9 21V9" />
        </svg>
      </div>
      <p className="text-sm text-[var(--text-faint)]">Demo pages are being prepared</p>
      <p className="text-xs text-[var(--text-muted)]">Check back soon</p>
    </div>
  )
}

export default async function DemosPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('pages')
    .select(`
      id, slug, title,
      templates!pages_template_id_fkey (name, slug, page_type),
      tiers!pages_tier_id_fkey (name)
    `)
    .eq('demo', true)
    .order('created_at')

  const demos = (rows ?? []).map((row) => {
    const template = row.templates as unknown as { name: string; slug: string; page_type: string } | null
    const tier = row.tiers as unknown as { name: string } | null
    const templateSlug = template?.slug ?? ''
    const colors = DEMO_COLORS[templateSlug] ?? { accent: '#c9a96e', bg: '#111111' }

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      pageType: template?.page_type ?? 'custom_page',
      tierName: tier?.name ?? 'Basic',
      templateName: template?.name ?? '',
      accentColor: colors.accent,
      bgColor: colors.bg,
    }
  })

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 sm:px-6 pt-20 pb-24 transition-colors duration-300">
      <div className="mx-auto max-w-6xl">

        <div className="mb-14">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs tracking-wide text-[var(--text-faint)] hover:text-[var(--gold)] transition-colors duration-200"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Our Memories
          </Link>
        </div>

        <div className="text-center mb-18">
          <p className="text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">Live demos</p>
          <h1 className="text-3xl font-light text-[var(--text)] sm:text-4xl tracking-tight">
            See what Our Memories can create
          </h1>
          <p className="mt-4 text-sm text-[var(--text-faint)] max-w-md mx-auto leading-relaxed">
            Each page below is a fully built example. Browse them, share the link — then create yours.
          </p>
          <div className="mt-8 mx-auto w-12 h-px bg-[var(--gold)]/20" />
        </div>

        {demos.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
            {demos.map((demo, i) => (
              <DemoCard key={demo.id} {...demo} index={i} />
            ))}
          </div>
        )}

        <div className="mt-20 text-center">
          <div className="mx-auto w-12 h-px bg-[var(--border)] mb-10" />
          <p className="text-sm text-[var(--text-faint)] mb-6">Ready to create your own?</p>
          <Link
            href="/templates"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--gold)] px-7 py-3 text-xs font-medium tracking-wide text-[#0a0a0a] transition-all duration-300 hover:bg-[var(--gold-light)] hover:scale-105 active:scale-95"
          >
            Browse Templates
            <IconArrow />
          </Link>
        </div>

      </div>
    </main>
  )
}
