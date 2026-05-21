import type { TemplateConfig } from '../types'
import classicElegance from './classic-elegance'
import cinematicWedding from './cinematic-wedding'
import royalWedding from './royal-wedding'
import milestoneBirthday from './milestone-birthday'
import gardenRomance from './garden-romance'
import gentleFarewell from './gentle-farewell'
import eternalDevotion from './eternal-devotion'
import foreverAndAlways from './forever-and-always'
import eternalTribute from './eternal-tribute'
import inLovingMemory from './in-loving-memory'
import glassAndGold from './glass-and-gold'
import simpleInvitation from './simple-invitation'
import classicBirthday from './classic-birthday'
import blackTieAffair from './black-tie-affair'
import goldenAnniversary from './golden-anniversary'
import fromTheHeart from './from-the-heart'
import bigSurprise from './big-surprise'
import celebrateWithUs from './celebrate-with-us'
import youAreInvited from './you-are-invited'
import blankCanvas from './blank-canvas'
import cinematicRose from './cinematic-rose'
import duskBloom from './dusk-bloom'
import secretAdmirer from './secret-admirer'
import pinkOrBlue from './pink-or-blue'
import vipParty from './vip-party'
import grandCeremony from './grand-ceremony'
import signaturePage from './signature-page'
import luxuryBirthday from './luxury-birthday'
import stardustReveal from './stardust-reveal'
import exclusiveSoiree from './exclusive-soiree'
import prestigeCeremony from './prestige-ceremony'
import bespokeCreation from './bespoke-creation'

const registry: Record<string, TemplateConfig> = {
  'classic-elegance': classicElegance,
  'cinematic-wedding': cinematicWedding,
  'royal-wedding': royalWedding,
  'milestone-birthday': milestoneBirthday,
  'garden-romance': gardenRomance,
  'gentle-farewell': gentleFarewell,
  'eternal-devotion': eternalDevotion,
  'forever-and-always': foreverAndAlways,
  'eternal-tribute': eternalTribute,
  'in-loving-memory': inLovingMemory,
  'glass-and-gold': glassAndGold,
  'simple-invitation': simpleInvitation,
  'classic-birthday': classicBirthday,
  'black-tie-affair': blackTieAffair,
  'golden-anniversary': goldenAnniversary,
  'from-the-heart': fromTheHeart,
  'big-surprise': bigSurprise,
  'celebrate-with-us': celebrateWithUs,
  'you-are-invited': youAreInvited,
  'blank-canvas': blankCanvas,
  'cinematic-rose': cinematicRose,
  'dusk-bloom': duskBloom,
  'secret-admirer': secretAdmirer,
  'pink-or-blue': pinkOrBlue,
  'vip-party': vipParty,
  'grand-ceremony': grandCeremony,
  'signature-page': signaturePage,
  'luxury-birthday': luxuryBirthday,
  'stardust-reveal': stardustReveal,
  'exclusive-soiree': exclusiveSoiree,
  'prestige-ceremony': prestigeCeremony,
  'bespoke-creation': bespokeCreation,
}

export function getTemplateConfig(
  slug: string,
  dbOverride?: Partial<TemplateConfig>
): TemplateConfig | null {
  const base = registry[slug]
  if (!base) return null
  if (!dbOverride || Object.keys(dbOverride).length === 0) return base
  return {
    ...base,
    ...dbOverride,
    theme: { ...base.theme, ...(dbOverride.theme ?? {}) },
    effects: { ...base.effects, ...(dbOverride.effects ?? {}) },
  }
}
