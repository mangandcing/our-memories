import type { TemplateConfig } from '../types'

const youAreInvited: TemplateConfig = {
  slug: 'you-are-invited',
  name: 'You Are Invited',
  tier: 'basic',
  theme: {
    background: '#080808',
    surface: '#100e0c',
    primary: '#f5f0e0',
    accent: '#b8a878',
    text: '#f5f0e0',
    subtext: '#706850',
    divider: '#181614',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1a1808 0%, #100e08 55%, #080806 100%)',
  },
  sections: ['hero', 'story', 'rsvp', 'map', 'gift', 'footer'],
  animations: 'minimal',
}

export default youAreInvited
