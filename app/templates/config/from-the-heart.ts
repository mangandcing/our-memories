import type { TemplateConfig } from '../types'

const fromTheHeart: TemplateConfig = {
  slug: 'from-the-heart',
  name: 'From the Heart',
  tier: 'basic',
  theme: {
    background: '#0a0608',
    surface: '#100a0d',
    primary: '#f5e0e5',
    accent: '#c97a8a',
    text: '#f5e0e5',
    subtext: '#7a4852',
    divider: '#1e101a',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 45%, #1e0a14 0%, #120810 55%, #08060a 100%)',
  },
  sections: ['hero', 'story', 'gift', 'footer'],
  animations: 'minimal',
}

export default fromTheHeart
