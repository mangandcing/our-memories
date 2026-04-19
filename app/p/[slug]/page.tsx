import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '../../lib/supabase-server'
import { getTemplateConfig } from '../../templates/config'
import TemplateRenderer from '../../templates/renderer/TemplateRenderer'
import FloatingThemeToggle from '../../components/ui/FloatingThemeToggle'
import type { PageData, MediaFile } from '../../templates/types'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('title')
    .eq('slug', slug)
    .maybeSingle()
  if (!data) return { title: 'Our Memories' }
  return { title: `${data.title} — Our Memories` }
}

export default async function PublicPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: page } = await supabase
    .from('pages')
    .select(
      `
      *,
      template:templates(id, slug, name, renderer_config),
      tier:tiers(name),
      media:media_files(id, type, url, storage_path, sort_order, file_name)
    `
    )
    .eq('slug', slug)
    .maybeSingle()

  if (!page) notFound()

  if (!page.demo && (!page.is_published || page.status !== 'active')) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#0a0a0a' }}
      >
        <div className="text-center max-w-xs">
          <div
            style={{ width: 1, height: 56, background: '#c9a96e', margin: '0 auto 2rem' }}
          />
          <h1
            className="text-xl font-light tracking-[0.18em] uppercase mb-4"
            style={{ fontFamily: 'Georgia, serif', color: '#f5e6c8' }}
          >
            This page is not available
          </h1>
          <p
            className="text-sm mb-10"
            style={{ color: '#6b6b6b', fontFamily: 'Georgia, serif' }}
          >
            This memory has not been published yet.
          </p>
          <a
            href="/"
            className="text-xs tracking-[0.25em] uppercase transition-opacity hover:opacity-60"
            style={{ color: '#c9a96e', fontFamily: 'Georgia, serif' }}
          >
            our-memories.store
          </a>
        </div>
      </div>
    )
  }

  const config = getTemplateConfig(
    page.template.slug,
    page.template.renderer_config
  )

  if (!config) notFound()

  await supabase
    .from('pages')
    .update({ view_count: (page.view_count ?? 0) + 1 })
    .eq('id', page.id)

  const isDemo = !!(page as { demo?: boolean }).demo
  const tierName = (page.tier as unknown as { name: string } | null)?.name ?? 'Basic'
  const isLuxury = tierName === 'Luxury'

  console.log(`[/p/${slug}] media count: ${(page.media ?? []).length}`)

  const pageData: PageData = {
    id: page.id,
    slug: page.slug,
    title: page.title,
    status: page.status,
    is_published: page.is_published,
    content: page.content ?? {},
    settings: page.settings ?? {},
    gift_enabled: page.gift_enabled ?? false,
    gift_qr_url: page.gift_qr_url ?? null,
    gift_phone: page.gift_phone ?? null,
    gift_note: page.gift_note ?? null,
    template: page.template,
    media: ((page.media ?? []) as MediaFile[]).sort(
      (a, b) => a.sort_order - b.sort_order
    ),
  }

  return (
    <>
      {isDemo && (
        <div
          className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-center gap-3 px-4 py-2.5 border-b"
          style={{
            background: 'rgba(10,10,10,0.97)',
            borderColor: 'rgba(201,169,110,0.15)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#c9a96e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <span className="text-[11px] text-[var(--text-muted)] tracking-wide">
            This is a demo page
          </span>
          <span className="text-[var(--text-dim)] text-[11px]">—</span>
          <a
            href="/"
            className="text-[11px] tracking-wide text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors duration-200"
          >
            Create yours at our-memories.store
          </a>
        </div>
      )}
      <div className={isDemo ? 'pt-10' : undefined}>
        <TemplateRenderer page={pageData} config={config} />
      </div>
      {!isLuxury && <FloatingThemeToggle />}
    </>
  )
}
