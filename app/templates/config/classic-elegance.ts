import type { TemplateConfig } from '../types'

const classicElegance: TemplateConfig = {
  slug: 'classic-elegance',
  name: 'Classic Elegance',
  tier: 'basic',
  theme: {
    background: '#0e0e0e',
    surface: '#131313',
    primary: '#f5f0e8',
    accent: '#b8a990',
    text: '#f5f0e8',
    subtext: '#7a7268',
    divider: '#242220',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1c1710 0%, #0e0e0e 55%, #080808 100%)',
  },
  sections: ['hero', 'story', 'map', 'gift', 'footer'],
  animations: 'minimal',
}

export default classicElegance
