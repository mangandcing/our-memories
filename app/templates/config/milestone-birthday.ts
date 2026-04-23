import type { TemplateConfig } from '../types'

const milestoneBirthday: TemplateConfig = {
  slug: 'milestone-birthday',
  name: 'Milestone Birthday',
  tier: 'premium',
  theme: {
    background: '#0d0508',
    surface: '#130810',
    primary: '#f5e8ef',
    accent: '#d4729a',
    text: '#f5e8ef',
    subtext: '#7a5060',
    divider: '#200f18',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'radial-gradient(ellipse at 45% 40%, #2a0f1f 0%, #1a0a14 50%, #0d050a 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'weather', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
}

export default milestoneBirthday
