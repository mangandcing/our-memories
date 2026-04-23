import type { TemplateConfig } from '../types'

const inLovingMemory: TemplateConfig = {
  slug: 'in-loving-memory',
  name: 'In Loving Memory',
  tier: 'premium',
  theme: {
    background: '#080c14',
    surface: '#0c1018',
    primary: '#edf0f5',
    accent: '#b0a8c8',
    text: '#edf0f5',
    subtext: '#606878',
    divider: '#141820',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #141c30 0%, #0c1020 55%, #080c14 100%)',
  },
  sections: ['hero', 'story', 'candle', 'gallery', 'weather', 'music', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default inLovingMemory
