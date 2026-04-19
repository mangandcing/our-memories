import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug')
  if (!slug) {
    return new NextResponse('Missing slug', { status: 400 })
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
  const url = `${base}/p/${slug}`

  const buffer = await QRCode.toBuffer(url, {
    type: 'png',
    width: 400,
    margin: 2,
    color: {
      dark: '#c9a96e',
      light: '#0a0a0a',
    },
  })

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
