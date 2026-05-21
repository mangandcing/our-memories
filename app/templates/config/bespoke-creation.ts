import type { TemplateConfig } from '../types'

const bespokeCreation: TemplateConfig = {
  slug: 'bespoke-creation',
  name: 'Bespoke Creation',
  tier: 'luxury',
  theme: {
    background: '#050505',
    surface: '#0a0a08',
    primary: '#f8f5ea',
    accent: '#d4af37',
    text: '#f8f5ea',
    subtext: '#5e5a48',
    divider: '#141410',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #1a1808 0%, #0e0c06 45%, #050504 100%)',
  },
  sections: [
    'hero',
    'story',
    'slideshow',
    'music',
    'countdown',
    'video',
    'voice',
    'weather',
    'guest_book',
    'gift',
    'footer',
  ],
  animations: 'dramatic',
  effects: {
    parallax: true,
  },
}

export default bespokeCreation
