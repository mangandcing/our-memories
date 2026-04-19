import type { TemplateConfig } from '../types'

const glassAndGold: TemplateConfig = {
  slug: 'glass-and-gold',
  name: 'Glass and Gold',
  tier: 'premium',
  theme: {
    background: '#050808',
    surface: '#080c0c',
    primary: '#edf5f4',
    accent: '#c9a96e',
    text: '#edf5f4',
    subtext: '#6a7070',
    divider: '#10181a',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'linear-gradient(150deg, #05080a 0%, #050a0e 45%, #080810 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'rsvp', 'map', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default glassAndGold
