import type { TemplateConfig } from '../types'

const eternalTribute: TemplateConfig = {
  slug: 'eternal-tribute',
  name: 'Eternal Tribute',
  tier: 'luxury',
  theme: {
    background: '#06050f',
    surface: '#0a0815',
    primary: '#e8eaf5',
    accent: '#a8a4c0',
    text: '#e8eaf5',
    subtext: '#5a5870',
    divider: '#141220',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1a1530 0%, #0d0a1e 45%, #06050f 100%)',
  },
  sections: ['hero', 'story', 'candle', 'slideshow', 'music', 'video', 'gift', 'footer'],
  animations: 'dramatic',
  effects: {
    parallax: true,
    particles: true,
  },
}

export default eternalTribute
