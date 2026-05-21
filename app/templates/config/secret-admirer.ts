import type { TemplateConfig } from '../types'

const secretAdmirer: TemplateConfig = {
  slug: 'secret-admirer',
  name: 'Secret Admirer',
  tier: 'premium',
  theme: {
    background: '#050308',
    surface: '#0a0510',
    primary: '#f0e0f0',
    accent: '#b878a8',
    text: '#f0e0f0',
    subtext: '#6a4870',
    divider: '#100818',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #08031a 0%, #060310 45%, #0a0518 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default secretAdmirer
