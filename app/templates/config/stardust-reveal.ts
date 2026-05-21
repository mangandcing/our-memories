import type { TemplateConfig } from '../types'

const stardustReveal: TemplateConfig = {
  slug: 'stardust-reveal',
  name: 'Stardust Reveal',
  tier: 'luxury',
  theme: {
    background: '#02020a',
    surface: '#05050f',
    primary: '#e8e0f5',
    accent: '#a08fd4',
    text: '#e8e0f5',
    subtext: '#5a5080',
    divider: '#0e0c18',
    font: 'var(--font-eb-garamond)',
    headingFont: 'var(--font-cinzel)',
    heroGradient:
      'radial-gradient(ellipse at 50% 40%, #1a1030 0%, #0e0818 45%, #020208 100%)',
  },
  sections: [
    'hero',
    'story',
    'slideshow',
    'music',
    'countdown',
    'video',
    'voice',
    'weather',
    'guest_book',
    'gift',
    'footer',
  ],
  animations: 'dramatic',
  effects: {
    parallax: true,
    particles: true,
  },
}

export default stardustReveal
