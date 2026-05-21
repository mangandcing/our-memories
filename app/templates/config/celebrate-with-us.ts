import type { TemplateConfig } from '../types'

const celebrateWithUs: TemplateConfig = {
  slug: 'celebrate-with-us',
  name: 'Celebrate With Us',
  tier: 'basic',
  theme: {
    background: '#0a0806',
    surface: '#131008',
    primary: '#f5ecd5',
    accent: '#e8a030',
    text: '#f5ecd5',
    subtext: '#7a6040',
    divider: '#221808',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1c1208 0%, #100e06 55%, #080604 100%)',
  },
  sections: ['hero', 'story', 'rsvp', 'map', 'gift', 'footer'],
  animations: 'minimal',
}

export default celebrateWithUs
