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
