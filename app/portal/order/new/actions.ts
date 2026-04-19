'use server'

import { createClient } from '../../../lib/supabase-server'

export async function checkSlugAvailable(slug: string): Promise<boolean> {
  if (!slug) return false
  const supabase = await createClient()
  const { data } = await supabase
    .from('pages')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  return !data
}

export async function submitOrder(payload: {
  templateId: string
  tierId: string
  durationPriceId: string
  title: string
  slug: string
  paymentMethod: string
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { success: false, error: 'Not authenticated' }

  const { data: dp } = await supabase
    .from('duration_prices')
    .select('price')
    .eq('id', payload.durationPriceId)
    .single()

  if (!dp) return { success: false, error: 'Invalid duration selected' }

  const { data: page, error: pageError } = await supabase
    .from('pages')
    .insert({
      user_id: user.id,
      template_id: payload.templateId,
      tier_id: payload.tierId,
      title: payload.title,
      slug: payload.slug,
      status: 'draft',
      content: {},
      settings: {},
    })
    .select('id')
    .single()

  if (pageError) return { success: false, error: pageError.message }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      user_id: user.id,
      page_id: page.id,
      tier_id: payload.tierId,
      duration_price_id: payload.durationPriceId,
      amount: dp.price,
      currency: 'MMK',
      payment_method: payload.paymentMethod,
      screenshot_url: '',
      status: 'awaiting_payment',
    })
    .select('id')
    .single()

  if (orderError) return { success: false, error: orderError.message }

  return { success: true, orderId: order.id }
}
