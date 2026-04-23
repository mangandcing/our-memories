import type { TemplateConfig } from '../types'

const royalWedding: TemplateConfig = {
  slug: 'royal-wedding',
  name: 'Royal Wedding',
  tier: 'luxury',
  theme: {
    background: '#03020a',
    surface: '#07060f',
    primary: '#f8f2e2',
    accent: '#d4af37',
    text: '#f8f2e2',
    subtext: '#5e5848',
    divider: '#16121e',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #1a0a2e 0%, #0d0818 45%, #03020a 100%)',
  },
  sections: [
    'hero',
    'story',
    'slideshow',
    'music',
    'countdown',
    'rsvp',
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

export default royalWedding
