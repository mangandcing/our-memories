import type { TemplateConfig } from '../types'

const goldenAnniversary: TemplateConfig = {
  slug: 'golden-anniversary',
  name: 'Golden Anniversary',
  tier: 'basic',
  theme: {
    background: '#0a0806',
    surface: '#100c08',
    primary: '#f5e8cc',
    accent: '#d4af37',
    text: '#f5e8cc',
    subtext: '#7a6030',
    divider: '#1e1408',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1e1408 0%, #100c08 55%, #080604 100%)',
  },
  sections: ['hero', 'story', 'gift', 'footer'],
  animations: 'minimal',
}

export default goldenAnniversary
