import type { TemplateConfig } from '../types'

const gardenRomance: TemplateConfig = {
  slug: 'garden-romance',
  name: 'Garden Romance',
  tier: 'premium',
  theme: {
    background: '#05100a',
    surface: '#091508',
    primary: '#eef5ee',
    accent: '#7aad8a',
    text: '#eef5ee',
    subtext: '#556b5a',
    divider: '#0f2014',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #0e2a18 0%, #0a1a10 55%, #050d08 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'rsvp', 'map', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
}

export default gardenRomance
