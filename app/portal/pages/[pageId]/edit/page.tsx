import { redirect, notFound } from 'next/navigation'
import { createClient } from '../../../../lib/supabase-server'
import PageEditor, { type MediaRow } from './PageEditor'

interface Props {
  params: Promise<{ pageId: string }>
}

export default async function EditPage({ params }: Props) {
  const { pageId } = await params
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: page } = await supabase
    .from('pages')
    .select(`
      id, slug, title, status, content, settings,
      gift_enabled, gift_phone, gift_qr_url, gift_note,
      show_in_gallery, user_id,
      tiers!pages_tier_id_fkey (name),
      templates!pages_template_id_fkey (slug, page_type),
      media:media_files!media_files_page_id_fkey (
        id, type, url, storage_path, sort_order,
        file_name, file_size, mime_type
      )
    `)
    .eq('id', pageId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!page) notFound()

  const tier = page.tiers as unknown as { name: string }
  const template = page.templates as unknown as { slug: string; page_type: string }
  const media = (page.media as unknown as MediaRow[]) ?? []

  return (
    <PageEditor
      id={page.id}
      slug={page.slug}
      title={page.title}
      status={page.status}
      content={(page.content as Record<string, unknown>) ?? {}}
      settings={(page.settings as Record<string, unknown>) ?? {}}
      gift_enabled={page.gift_enabled ?? false}
      gift_phone={page.gift_phone ?? null}
      gift_qr_url={page.gift_qr_url ?? null}
      gift_note={page.gift_note ?? null}
      page_type={template.page_type}
      tier_name={tier.name}
      media={media}
      user_id={user.id}
      show_in_gallery={page.show_in_gallery ?? false}
    />
  )
}
