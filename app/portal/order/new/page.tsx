import { createClient } from '../../../lib/supabase-server'
import NewOrderWizard from './NewOrderWizard'

export default async function NewOrderPage() {
  const supabase = await createClient()

  const [
    { data: tiers },
    { data: durationPrices },
    { data: templates },
  ] = await Promise.all([
    supabase
      .from('tiers')
      .select('id, name, features, sort_order')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('duration_prices')
      .select('id, tier_id, duration_months, price, label')
      .eq('is_active', true),
    supabase
      .from('templates')
      .select('id, name, slug, tier_id, page_type, thumbnail_url')
      .eq('is_active', true)
      .order('sort_order'),
  ])

  return (
    <NewOrderWizard
      tiers={tiers ?? []}
      durationPrices={durationPrices ?? []}
      templates={templates ?? []}
    />
  )
}
