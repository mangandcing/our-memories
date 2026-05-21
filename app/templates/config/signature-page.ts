import type { TemplateConfig } from '../types'

const signaturePage: TemplateConfig = {
  slug: 'signature-page',
  name: 'Signature Page',
  tier: 'premium',
  theme: {
    background: '#050505',
    surface: '#0a0a0a',
    primary: '#f5f0e8',
    accent: '#c9a96e',
    text: '#f5f0e8',
    subtext: '#6e6458',
    divider: '#181614',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #080806 0%, #060606 45%, #0a0805 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default signaturePage
