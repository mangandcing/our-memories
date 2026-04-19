'use server'

import { createAdminClient } from '../lib/supabase-admin'

export async function getQuickStats() {
  const supabase = createAdminClient()

  const [{ count: pendingOrders }, { data: approvedOrders }] = await Promise.all([
    supabase
      .from('orders')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('orders')
      .select('page_id')
      .eq('status', 'approved'),
  ])

  const approvedPageIds = (approvedOrders ?? []).map((o) => o.page_id)

  let pagesWaiting = 0
  if (approvedPageIds.length > 0) {
    const { count } = await supabase
      .from('pages')
      .select('id', { count: 'exact', head: true })
      .eq('is_published', false)
      .in('id', approvedPageIds)
    pagesWaiting = count ?? 0
  }

  return {
    pendingOrders: pendingOrders ?? 0,
    pagesWaiting,
  }
}
