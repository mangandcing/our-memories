import type { TemplateConfig } from '../types'

const blankCanvas: TemplateConfig = {
  slug: 'blank-canvas',
  name: 'Blank Canvas',
  tier: 'basic',
  theme: {
    background: '#0a0a0a',
    surface: '#121212',
    primary: '#f5f0e8',
    accent: '#c9a96e',
    text: '#f5f0e8',
    subtext: '#6e6458',
    divider: '#1e1c1a',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1a1810 0%, #0e0c08 55%, #0a0a0a 100%)',
  },
  sections: ['hero', 'story', 'gift', 'footer'],
  animations: 'minimal',
}

export default blankCanvas
