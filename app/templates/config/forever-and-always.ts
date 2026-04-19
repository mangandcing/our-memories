import type { TemplateConfig } from '../types'

const foreverAndAlways: TemplateConfig = {
  slug: 'forever-and-always',
  name: 'Forever and Always',
  tier: 'premium',
  theme: {
    background: '#060d0d',
    surface: '#0a1414',
    primary: '#e8f5f5',
    accent: '#6ebfbf',
    text: '#e8f5f5',
    subtext: '#4a7070',
    divider: '#0f1e1e',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'radial-gradient(ellipse at 45% 40%, #0e2a2a 0%, #0a1a1a 55%, #050d0d 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
}

export default foreverAndAlways
