'use client'

interface QRCodeImageProps {
  slug: string
  size?: number
  className?: string
}

export default function QRCodeImage({ slug, size = 200, className }: QRCodeImageProps) {
  return (
    <img
      src={`/api/qr?slug=${encodeURIComponent(slug)}`}
      alt={`QR code for ${slug}`}
      width={size}
      height={size}
      className={className}
      style={{ imageRendering: 'pixelated' }}
    />
  )
}
