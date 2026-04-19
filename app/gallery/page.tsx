import type { Metadata } from 'next'
import { createClient } from '../lib/supabase-server'
import GalleryGrid, { type GalleryPageData } from './GalleryGrid'

export const metadata: Metadata = {
  title: 'Gallery — Our Memories',
  description: 'Beautiful memory pages created by our community',
}

export const revalidate = 60

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: rows } = await supabase
    .from('pages')
    .select(`
      id, slug, title, view_count,
      templates!pages_template_id_fkey (name, page_type, renderer_config),
      tiers!pages_tier_id_fkey (name)
    `)
    .eq('is_published', true)
    .eq('show_in_gallery', true)
    .order('created_at', { ascending: false })
    .limit(200)

  const pages: GalleryPageData[] = (rows ?? []).map((row) => {
    const template = row.templates as unknown as {
      name: string
      page_type: string
      renderer_config: { theme?: { accent?: string; background?: string } }
    } | null
    const tier = row.tiers as unknown as { name: string } | null
    const theme = template?.renderer_config?.theme ?? {}

    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      view_count: row.view_count ?? 0,
      page_type: template?.page_type ?? 'custom_page',
      tier_name: tier?.name ?? 'Basic',
      template_name: template?.name ?? '',
      accent_color: theme.accent ?? '#c9a96e',
      bg_color: theme.background ?? '#0e0e0e',
    }
  })

  return (
    <main className="min-h-screen bg-[var(--bg)] px-4 sm:px-6 pt-28 pb-20 transition-colors duration-300">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-xs tracking-[0.35em] uppercase text-[var(--gold)] mb-4">Community</p>
          <h1 className="text-3xl font-light text-[var(--text)] sm:text-4xl tracking-tight">Gallery</h1>
          <p className="mt-4 text-sm text-[var(--text-faint)] max-w-md mx-auto">
            Beautiful memory pages created by our community
          </p>
          <div className="mt-6 mx-auto w-12 h-px bg-[var(--gold)]/20" />
        </div>

        {/* Grid or empty state */}
        {pages.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-5 text-center">
            <div className="w-16 h-16 rounded-full border border-[var(--border)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--border-hover)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <path d="M3 9h18M9 21V9" />
              </svg>
            </div>
            <p className="text-sm text-[var(--text-faint)]">No pages in the gallery yet</p>
            <p className="text-xs text-[var(--text-muted)]">Be the first to share yours</p>
          </div>
        ) : (
          <GalleryGrid pages={pages} />
        )}
      </div>
    </main>
  )
}
