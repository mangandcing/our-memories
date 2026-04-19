import { createClient } from '../../lib/supabase-server'
import TemplatesGrid from '../../components/templates/TemplatesGrid'
import type { TemplateWithTier } from '../../components/templates/TemplateCard'

export const metadata = {
  title: 'Browse Templates — Our Memories',
  description: 'Choose from 30 beautiful templates to celebrate your most precious moments.',
}

const TIER_ORDER: Record<string, number> = { Luxury: 0, Premium: 1, Basic: 2 }

export default async function TemplatesPage() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('templates')
    .select('id, name, slug, page_type, thumbnail_url, renderer_config, tiers(id, name, sort_order)')
    .eq('is_active', true)
    .order('sort_order')

  const templates = ((data ?? []) as unknown as TemplateWithTier[]).sort((a, b) => {
    const ao = TIER_ORDER[a.tiers?.name] ?? 9
    const bo = TIER_ORDER[b.tiers?.name] ?? 9
    return ao - bo
  })

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Hero */}
      <div
        className="relative pt-20 pb-16 px-4 text-center"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, #1a1208 0%, #0d0a04 50%, var(--bg) 100%)',
        }}
      >
        <p className="text-[11px] tracking-[0.4em] uppercase mb-4" style={{ color: 'rgba(201,169,110,0.6)' }}>
          30 Templates
        </p>
        <h1 className="text-4xl sm:text-5xl font-light tracking-wide mb-4" style={{ color: 'var(--text)' }}>
          Browse Templates
        </h1>
        <p className="text-sm font-light max-w-md mx-auto" style={{ color: 'var(--text-muted)' }}>
          Every template is crafted to turn your most precious moments into a cinematic experience.
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        <TemplatesGrid templates={templates} />
      </div>
    </main>
  )
}
