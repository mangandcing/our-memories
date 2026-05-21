import type { TemplateConfig } from '../types'

const vipParty: TemplateConfig = {
  slug: 'vip-party',
  name: 'VIP Party',
  tier: 'premium',
  theme: {
    background: '#080805',
    surface: '#0f0f08',
    primary: '#f5f0d8',
    accent: '#d4a93e',
    text: '#f5f0d8',
    subtext: '#7a6838',
    divider: '#1e1808',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'linear-gradient(160deg, #0f0d03 0%, #080806 45%, #100e08 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'rsvp', 'map', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default vipParty
