export type SectionKey =
  | 'hero'
  | 'story'
  | 'gallery'
  | 'slideshow'
  | 'music'
  | 'countdown'
  | 'rsvp'
  | 'love_letter'
  | 'video'
  | 'games'
  | 'gift'
  | 'candle'
  | 'guest_book'
  | 'map'
  | 'footer'

export type AnimationVariant = 'minimal' | 'cinematic' | 'dramatic'
export type TierKey = 'basic' | 'premium' | 'luxury'

export interface TemplateTheme {
  background: string
  surface: string
  primary: string
  accent: string
  text: string
  subtext: string
  divider: string
  font: string
  headingFont: string
  heroGradient: string
}

export interface TemplateEffects {
  filmGrain?: boolean
  parallax?: boolean
  particles?: boolean
}

export interface TemplateConfig {
  slug: string
  name: string
  tier: TierKey
  theme: TemplateTheme
  sections: SectionKey[]
  animations: AnimationVariant
  effects?: TemplateEffects
}

export interface MediaFile {
  id: string
  type: 'photo' | 'video' | 'audio'
  url: string
  storage_path: string
  sort_order: number
  file_name?: string
}

export interface PageContent {
  heroSubtitle?: string
  story?: string
  date?: string
  venue?: string
  venueName?: string
  venueAddress?: string
  brideName?: string
  groomName?: string
  [key: string]: unknown
}

export interface PageData {
  id: string
  slug: string
  title: string
  status: 'draft' | 'active' | 'expired' | 'pending_review'
  is_published: boolean
  content: PageContent
  settings: Record<string, unknown>
  gift_enabled: boolean
  gift_qr_url: string | null
  gift_phone: string | null
  gift_note: string | null
  template: {
    id: string
    slug: string
    name: string
    renderer_config: Partial<TemplateConfig>
  }
  media: MediaFile[]
}

export interface SectionProps {
  page: PageData
  theme: TemplateTheme
  animations: AnimationVariant
  effects?: TemplateEffects
  tierName: TierKey
}

export function getMotionVariants(animation: AnimationVariant) {
  const bez = [0.16, 1, 0.3, 1] as [number, number, number, number]
  switch (animation) {
    case 'minimal':
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      }
    case 'cinematic':
      return {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: bez } },
      }
    case 'dramatic':
      return {
        hidden: { opacity: 0, y: 48 },
        visible: { opacity: 1, y: 0, transition: { duration: 1.5, ease: bez } },
      }
    default:
      return {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.8 } },
      }
  }
}
