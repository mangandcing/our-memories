import type { TemplateConfig } from '../types'

const prestigeCeremony: TemplateConfig = {
  slug: 'prestige-ceremony',
  name: 'Prestige Ceremony',
  tier: 'luxury',
  theme: {
    background: '#030508',
    surface: '#050810',
    primary: '#f0ecd8',
    accent: '#c9a96e',
    text: '#f0ecd8',
    subtext: '#5a5840',
    divider: '#10100a',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #0a0c1a 0%, #080a14 45%, #030508 100%)',
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

export default prestigeCeremony
