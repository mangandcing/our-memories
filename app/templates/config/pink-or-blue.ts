import type { TemplateConfig } from '../types'

const pinkOrBlue: TemplateConfig = {
  slug: 'pink-or-blue',
  name: 'Pink or Blue',
  tier: 'premium',
  theme: {
    background: '#050508',
    surface: '#080810',
    primary: '#f0e8f5',
    accent: '#c9a0d4',
    text: '#f0e8f5',
    subtext: '#6a5878',
    divider: '#100c18',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #08050f 0%, #060508 45%, #080510 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
}

export default pinkOrBlue
