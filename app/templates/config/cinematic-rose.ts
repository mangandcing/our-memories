import type { TemplateConfig } from '../types'

const cinematicRose: TemplateConfig = {
  slug: 'cinematic-rose',
  name: 'Cinematic Rose',
  tier: 'premium',
  theme: {
    background: '#080508',
    surface: '#0d080c',
    primary: '#f5e0e8',
    accent: '#c9698a',
    text: '#f5e0e8',
    subtext: '#7a4858',
    divider: '#180d16',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #0f0508 0%, #080508 45%, #0a0510 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default cinematicRose
