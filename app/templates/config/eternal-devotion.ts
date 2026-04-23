import type { TemplateConfig } from '../types'

const eternalDevotion: TemplateConfig = {
  slug: 'eternal-devotion',
  name: 'Eternal Devotion',
  tier: 'luxury',
  theme: {
    background: '#0a0404',
    surface: '#120608',
    primary: '#f5e8ea',
    accent: '#c96e7a',
    text: '#f5e8ea',
    subtext: '#7a4a52',
    divider: '#1e0c10',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 55% 35%, #2a0a0e 0%, #1a0a0a 45%, #0d0505 100%)',
  },
  sections: ['hero', 'story', 'slideshow', 'music', 'video', 'voice', 'weather', 'gift', 'footer'],
  animations: 'dramatic',
  effects: {
    parallax: true,
    particles: true,
  },
}

export default eternalDevotion
