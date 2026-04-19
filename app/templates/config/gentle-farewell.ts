import type { TemplateConfig } from '../types'

const gentleFarewell: TemplateConfig = {
  slug: 'gentle-farewell',
  name: 'Gentle Farewell',
  tier: 'basic',
  theme: {
    background: '#07090f',
    surface: '#0b0d16',
    primary: '#e8edf5',
    accent: '#9ba8b8',
    text: '#e8edf5',
    subtext: '#5a6270',
    divider: '#10141e',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 45%, #0d1526 0%, #0a0f1a 55%, #060a10 100%)',
  },
  sections: ['hero', 'story', 'candle', 'gift', 'footer'],
  animations: 'minimal',
}

export default gentleFarewell
