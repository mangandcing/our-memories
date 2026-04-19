'use client'

const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  story: 'Story',
  gallery: 'Gallery',
  music: 'Music',
  countdown: 'Countdown',
  rsvp: 'RSVP',
  video: 'Video',
  gift: 'Gift',
  candle: 'Candle',
  map: 'Map',
  guest_book: 'Guest Book',
  slideshow: 'Slideshow',
  footer: 'Footer',
}

const PREMIUM_SECTIONS = new Set(['gallery', 'music', 'countdown', 'rsvp', 'guest_book', 'slideshow', 'video'])

function SectionIcon({ section }: { section: string }) {
  const props = { width: 10, height: 10, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  switch (section) {
    case 'hero':
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/></svg>
    case 'story':
      return <svg {...props}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
    case 'gallery':
      return <svg {...props}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
    case 'music':
      return <svg {...props}><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
    case 'countdown':
      return <svg {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
    case 'rsvp':
      return <svg {...props}><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
    case 'video':
      return <svg {...props}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
    case 'gift':
      return <svg {...props}><polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/><line x1="12" y1="22" x2="12" y2="7"/><path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/><path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/></svg>
    case 'candle':
      return <svg {...props}><line x1="12" y1="2" x2="12" y2="4"/><path d="M9 8a3 3 0 0 1 6 0c0 4-3 6-3 6s-3-2-3-6z"/><line x1="12" y1="14" x2="12" y2="22"/><line x1="9" y1="22" x2="15" y2="22"/></svg>
    case 'map':
      return <svg {...props}><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
    case 'guest_book':
      return <svg {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
    case 'slideshow':
      return <svg {...props}><rect x="2" y="7" width="20" height="15" rx="2"/><polyline points="17 2 12 7 7 2"/></svg>
    default:
      return <svg {...props}><circle cx="12" cy="12" r="10"/></svg>
  }
}

export default function SectionBadge({ section }: { section: string }) {
  if (section === 'footer') return null
  const isPremium = PREMIUM_SECTIONS.has(section)
  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded text-[10px] tracking-wide"
      style={{
        border: isPremium ? '1px solid rgba(201,169,110,0.3)' : '1px solid rgba(255,255,255,0.08)',
        color: isPremium ? '#c9a96e' : '#6a5c4a',
        background: isPremium ? 'rgba(201,169,110,0.05)' : 'transparent',
      }}
    >
      <SectionIcon section={section} />
      {SECTION_LABELS[section] ?? section}
    </span>
  )
}
