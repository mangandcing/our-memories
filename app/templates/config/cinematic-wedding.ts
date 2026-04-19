import type { TemplateConfig } from '../types'

const cinematicWedding: TemplateConfig = {
  slug: 'cinematic-wedding',
  name: 'Cinematic Wedding',
  tier: 'premium',
  theme: {
    background: '#050505',
    surface: '#0a0a0a',
    primary: '#ede4d3',
    accent: '#c9a96e',
    text: '#ede4d3',
    subtext: '#6e6458',
    divider: '#181410',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #05050f 0%, #050508 45%, #080510 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default cinematicWedding
