import type { TemplateConfig } from '../types'

const bigSurprise: TemplateConfig = {
  slug: 'big-surprise',
  name: 'Big Surprise',
  tier: 'basic',
  theme: {
    background: '#080a10',
    surface: '#0d1018',
    primary: '#e0e8f5',
    accent: '#7a9ed4',
    text: '#e0e8f5',
    subtext: '#4a6080',
    divider: '#101620',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #0a1022 0%, #080c18 55%, #060810 100%)',
  },
  sections: ['hero', 'story', 'gift', 'footer'],
  animations: 'minimal',
}

export default bigSurprise
