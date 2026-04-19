import { notFound, redirect } from 'next/navigation'
import { createClient } from '../../../lib/supabase-server'
import { getTemplateConfig } from '../../../templates/config'
import TemplateRenderer from '../../../templates/renderer/TemplateRenderer'
import type { PageData, MediaFile } from '../../../templates/types'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function PreviewPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/')

  const { data: page } = await supabase
    .from('pages')
    .select(
      `
      *,
      template:templates(id, slug, name, renderer_config),
      media:media_files(id, type, url, storage_path, sort_order, file_name)
    `
    )
    .eq('slug', slug)
    .maybeSingle()

  if (!page) notFound()

  if (page.user_id !== user.id) redirect('/portal/pages')

  const config = getTemplateConfig(
    page.template.slug,
    page.template.renderer_config
  )

  if (!config) {
    return (
      <div className="fixed inset-0 bg-[var(--bg)] flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-[var(--gold)]/10 flex items-center justify-center mb-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 2 7 12 12 22 7 12 2" />
            <polyline points="2 17 12 22 22 17" />
            <polyline points="2 12 12 17 22 12" />
          </svg>
        </div>
        <h2 className="text-base font-light text-[var(--gold)] tracking-wide">
          Preview not available yet
        </h2>
        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed">
          This template is being prepared.
          <br />
          Your content is saved.
        </p>
      </div>
    )
  }

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
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="sticky top-0 z-10 flex items-center justify-center py-3 px-4 text-center"
        style={{ background: 'rgba(201,169,110,0.95)', backdropFilter: 'blur(4px)' }}
      >
        <p className="text-xs tracking-[0.2em] uppercase font-medium text-black">
          Preview Mode &mdash; This page is not yet published
        </p>
      </div>
      <TemplateRenderer page={pageData} config={config} />
    </div>
  )
}
