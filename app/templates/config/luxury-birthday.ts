import type { TemplateConfig } from '../types'

const luxuryBirthday: TemplateConfig = {
  slug: 'luxury-birthday',
  name: 'Luxury Birthday',
  tier: 'luxury',
  theme: {
    background: '#05030a',
    surface: '#080512',
    primary: '#f8f2e0',
    accent: '#d4af37',
    text: '#f8f2e0',
    subtext: '#5e5030',
    divider: '#14100e',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #2a1a04 0%, #1a1004 45%, #05030a 100%)',
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
    particles: true,
  },
}

export default luxuryBirthday
