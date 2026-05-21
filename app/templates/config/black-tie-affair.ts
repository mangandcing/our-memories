import type { TemplateConfig } from '../types'

const blackTieAffair: TemplateConfig = {
  slug: 'black-tie-affair',
  name: 'Black Tie Affair',
  tier: 'basic',
  theme: {
    background: '#080808',
    surface: '#0e0e0e',
    primary: '#f0f0f0',
    accent: '#c0c0c0',
    text: '#f0f0f0',
    subtext: '#606060',
    divider: '#181818',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1a1a1a 0%, #0e0e0e 55%, #060606 100%)',
  },
  sections: ['hero', 'story', 'rsvp', 'map', 'gift', 'footer'],
  animations: 'minimal',
}

export default blackTieAffair
