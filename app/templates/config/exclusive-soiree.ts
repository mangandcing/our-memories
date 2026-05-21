import type { TemplateConfig } from '../types'

const exclusiveSoiree: TemplateConfig = {
  slug: 'exclusive-soiree',
  name: 'Exclusive Soirée',
  tier: 'luxury',
  theme: {
    background: '#030303',
    surface: '#070707',
    primary: '#f8f5e8',
    accent: '#d4af37',
    text: '#f8f5e8',
    subtext: '#5e5a40',
    divider: '#141208',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #1a1608 0%, #0e0c06 45%, #030302 100%)',
  },
  sections: [
    'hero',
    'story',
    'slideshow',
    'music',
    'countdown',
    'video',
    'voice',
    'rsvp',
    'map',
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

export default exclusiveSoiree
