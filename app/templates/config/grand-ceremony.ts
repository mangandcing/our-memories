import type { TemplateConfig } from '../types'

const grandCeremony: TemplateConfig = {
  slug: 'grand-ceremony',
  name: 'Grand Ceremony',
  tier: 'premium',
  theme: {
    background: '#050508',
    surface: '#080810',
    primary: '#e8edf5',
    accent: '#a8b8c9',
    text: '#e8edf5',
    subtext: '#5a6878',
    divider: '#0e1218',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #050818 0%, #050810 45%, #080a14 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'rsvp', 'map', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
}

export default grandCeremony
