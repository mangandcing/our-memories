import { notFound, redirect } from 'next/navigation'
import { getOrderWithDetails, getPaymentSettings } from './actions'
import PayUploadClient from './PayUploadClient'

export default async function PayPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params

  const [order, settings] = await Promise.all([
    getOrderWithDetails(orderId),
    getPaymentSettings(),
  ])

  if (!order) notFound()

  if (order.status !== 'awaiting_payment') {
    redirect('/portal/pages')
  }

  return <PayUploadClient order={order} settings={settings} orderId={orderId} />
}
