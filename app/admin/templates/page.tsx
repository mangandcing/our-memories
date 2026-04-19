import { createAdminClient } from '../../lib/supabase-admin'

export default async function AdminTemplatesPage() {
  const admin = createAdminClient()
  const { data: templates } = await admin
    .from('templates')
    .select(`
      id, name, slug, page_type, thumbnail_url, sort_order, is_active,
      tiers!templates_tier_id_fkey (name)
    `)
    .order('sort_order')

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[var(--text)]">Templates</h1>
        <p className="text-sm text-[var(--text-muted)] mt-0.5">
          {templates?.length ?? 0} templates — template editing coming soon
        </p>
      </div>

      <div className="bg-[var(--surface)] border border-[var(--border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {['Name', 'Slug', 'Tier', 'Page Type', 'Sort', 'Active'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs text-[var(--text-muted)] font-medium whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(templates ?? []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-[var(--text-muted)]">
                    No templates found — run the seed file in Supabase to add templates
                  </td>
                </tr>
              ) : (
                (templates ?? []).map((t: any) => (
                  <tr key={t.id} className="border-b border-[var(--surface-3)] last:border-0 hover:bg-[var(--surface-2)] transition-colors">
                    <td className="px-5 py-3.5 text-[var(--text)] font-medium">{t.name}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] font-mono text-xs">{t.slug}</td>
                    <td className="px-5 py-3.5 text-[var(--text)]">{t.tiers?.name ?? '—'}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)] capitalize">{t.page_type?.replace(/_/g, ' ')}</td>
                    <td className="px-5 py-3.5 text-[var(--text-muted)]">{t.sort_order}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${
                        t.is_active ? 'bg-green-500/15 text-green-400' : 'bg-slate-500/15 text-slate-400'
                      }`}>
                        {t.is_active ? 'yes' : 'no'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
