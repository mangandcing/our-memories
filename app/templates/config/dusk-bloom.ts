import type { TemplateConfig } from '../types'

const duskBloom: TemplateConfig = {
  slug: 'dusk-bloom',
  name: 'Dusk Bloom',
  tier: 'premium',
  theme: {
    background: '#080508',
    surface: '#0d080a',
    primary: '#f5e8dc',
    accent: '#e8956a',
    text: '#f5e8dc',
    subtext: '#7a5848',
    divider: '#180e0a',
    font: 'var(--font-playfair)',
    headingFont: 'var(--font-playfair)',
    heroGradient:
      'linear-gradient(160deg, #0f0808 0%, #0a0608 45%, #100808 100%)',
  },
  sections: ['hero', 'story', 'gallery', 'weather', 'music', 'countdown', 'guest_book', 'gift', 'footer'],
  animations: 'cinematic',
  effects: {
    filmGrain: true,
  },
}

export default duskBloom
