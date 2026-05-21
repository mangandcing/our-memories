import type { TemplateConfig } from '../types'

const classicBirthday: TemplateConfig = {
  slug: 'classic-birthday',
  name: 'Classic Birthday',
  tier: 'basic',
  theme: {
    background: '#0e0a06',
    surface: '#131008',
    primary: '#f5ecd5',
    accent: '#e8a030',
    text: '#f5ecd5',
    subtext: '#7a6040',
    divider: '#221808',
    font: 'var(--font-cormorant)',
    headingFont: 'var(--font-cormorant)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1c1208 0%, #0e0a06 55%, #080603 100%)',
  },
  sections: ['hero', 'story', 'gift', 'footer'],
  animations: 'minimal',
}

export default classicBirthday
