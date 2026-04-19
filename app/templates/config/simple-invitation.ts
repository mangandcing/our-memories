import type { TemplateConfig } from '../types'

const simpleInvitation: TemplateConfig = {
  slug: 'simple-invitation',
  name: 'Simple Invitation',
  tier: 'basic',
  theme: {
    background: '#0e0c0a',
    surface: '#141210',
    primary: '#f5ede0',
    accent: '#c4a882',
    text: '#f5ede0',
    subtext: '#7a6855',
    divider: '#242018',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1c160e 0%, #0e0c0a 55%, #090806 100%)',
  },
  sections: ['hero', 'story', 'map', 'gift', 'footer'],
  animations: 'minimal',
}

export default simpleInvitation
