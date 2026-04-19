-- Renderer configs for all templates.
-- Run after seed.sql and seed-templates.sql.
-- Re-run anytime to sync code configs → database.

UPDATE templates
SET renderer_config = '{
  "slug": "classic-elegance",
  "name": "Classic Elegance",
  "tier": "basic",
  "theme": {
    "background": "#0e0e0e",
    "surface": "#131313",
    "primary": "#f5f0e8",
    "accent": "#b8a990",
    "text": "#f5f0e8",
    "subtext": "#7a7268",
    "divider": "#242220",
    "font": "var(--font-cormorant)",
    "headingFont": "var(--font-cormorant)",
    "heroGradient": "radial-gradient(ellipse at 50% 40%, #1c1710 0%, #0e0e0e 55%, #080808 100%)"
  },
  "sections": ["hero", "story", "map", "gift", "footer"],
  "animations": "minimal"
}'
WHERE slug = 'classic-elegance';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "cinematic-wedding",
  "name": "Cinematic Wedding",
  "tier": "premium",
  "theme": {
    "background": "#050505",
    "surface": "#0a0a0a",
    "primary": "#ede4d3",
    "accent": "#c9a96e",
    "text": "#ede4d3",
    "subtext": "#6e6458",
    "divider": "#181410",
    "font": "var(--font-playfair)",
    "headingFont": "var(--font-playfair)",
    "heroGradient": "linear-gradient(160deg, #05050f 0%, #050508 45%, #080510 100%)"
  },
  "sections": ["hero", "story", "gallery", "music", "countdown", "guest_book", "gift", "footer"],
  "animations": "cinematic",
  "effects": {
    "filmGrain": true
  }
}'
WHERE slug = 'cinematic-wedding';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "royal-wedding",
  "name": "Royal Wedding",
  "tier": "luxury",
  "theme": {
    "background": "#03020a",
    "surface": "#07060f",
    "primary": "#f8f2e2",
    "accent": "#d4af37",
    "text": "#f8f2e2",
    "subtext": "#5e5848",
    "divider": "#16121e",
    "font": "var(--font-eb-garamond)",
    "headingFont": "var(--font-cinzel)",
    "heroGradient": "radial-gradient(ellipse at 55% 35%, #1a0a2e 0%, #0d0818 45%, #03020a 100%)"
  },
  "sections": ["hero", "story", "slideshow", "music", "countdown", "rsvp", "video", "guest_book", "gift", "footer"],
  "animations": "dramatic",
  "effects": {
    "parallax": true,
    "particles": true
  }
}'
WHERE slug = 'royal-wedding';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "milestone-birthday",
  "name": "Milestone Birthday",
  "tier": "premium",
  "theme": {
    "background": "#0d0508",
    "surface": "#130810",
    "primary": "#f5e8ef",
    "accent": "#d4729a",
    "text": "#f5e8ef",
    "subtext": "#7a5060",
    "divider": "#200f18",
    "font": "var(--font-playfair)",
    "headingFont": "var(--font-playfair)",
    "heroGradient": "radial-gradient(ellipse at 45% 40%, #2a0f1f 0%, #1a0a14 50%, #0d050a 100%)"
  },
  "sections": ["hero", "story", "gallery", "music", "countdown", "guest_book", "gift", "footer"],
  "animations": "cinematic"
}'
WHERE slug = 'milestone-birthday';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "garden-romance",
  "name": "Garden Romance",
  "tier": "premium",
  "theme": {
    "background": "#05100a",
    "surface": "#091508",
    "primary": "#eef5ee",
    "accent": "#7aad8a",
    "text": "#eef5ee",
    "subtext": "#556b5a",
    "divider": "#0f2014",
    "font": "var(--font-cormorant)",
    "headingFont": "var(--font-cormorant)",
    "heroGradient": "radial-gradient(ellipse at 50% 40%, #0e2a18 0%, #0a1a10 55%, #050d08 100%)"
  },
  "sections": ["hero", "story", "gallery", "music", "countdown", "rsvp", "map", "guest_book", "gift", "footer"],
  "animations": "cinematic"
}'
WHERE slug = 'garden-romance';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "gentle-farewell",
  "name": "Gentle Farewell",
  "tier": "basic",
  "theme": {
    "background": "#07090f",
    "surface": "#0b0d16",
    "primary": "#e8edf5",
    "accent": "#9ba8b8",
    "text": "#e8edf5",
    "subtext": "#5a6270",
    "divider": "#10141e",
    "font": "var(--font-cormorant)",
    "headingFont": "var(--font-cormorant)",
    "heroGradient": "radial-gradient(ellipse at 50% 45%, #0d1526 0%, #0a0f1a 55%, #060a10 100%)"
  },
  "sections": ["hero", "story", "candle", "gift", "footer"],
  "animations": "minimal"
}'
WHERE slug = 'gentle-farewell';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "eternal-devotion",
  "name": "Eternal Devotion",
  "tier": "luxury",
  "theme": {
    "background": "#0a0404",
    "surface": "#120608",
    "primary": "#f5e8ea",
    "accent": "#c96e7a",
    "text": "#f5e8ea",
    "subtext": "#7a4a52",
    "divider": "#1e0c10",
    "font": "var(--font-eb-garamond)",
    "headingFont": "var(--font-cinzel)",
    "heroGradient": "radial-gradient(ellipse at 55% 35%, #2a0a0e 0%, #1a0a0a 45%, #0d0505 100%)"
  },
  "sections": ["hero", "story", "slideshow", "music", "video", "gift", "footer"],
  "animations": "dramatic",
  "effects": {
    "parallax": true,
    "particles": true
  }
}'
WHERE slug = 'eternal-devotion';

-- ─────────────────────────────────────────────────────────────

UPDATE templates
SET renderer_config = '{
  "slug": "forever-and-always",
  "name": "Forever and Always",
  "tier": "premium",
  "theme": {
    "background": "#060d0d",
    "surface": "#0a1414",
    "primary": "#e8f5f5",
    "accent": "#6ebfbf",
    "text": "#e8f5f5",
    "subtext": "#4a7070",
    "divider": "#0f1e1e",
    "font": "var(--font-playfair)",
    "headingFont": "var(--font-playfair)",
    "heroGradient": "radial-gradient(ellipse at 45% 40%, #0e2a2a 0%, #0a1a1a 55%, #050d0d 100%)"
  },
  "sections": ["hero", "story", "gallery", "music", "countdown", "guest_book", "gift", "footer"],
  "animations": "cinematic"
}'
WHERE slug = 'forever-and-always';

-- ─────────────────────────────────────────────────────────────
-- New templates — INSERT if not exists, otherwise UPDATE

INSERT INTO templates (slug, name, tier, is_active, renderer_config)
VALUES (
  'eternal-tribute',
  'Eternal Tribute',
  'luxury',
  true,
  '{
    "slug": "eternal-tribute",
    "name": "Eternal Tribute",
    "tier": "luxury",
    "theme": {
      "background": "#06050f",
      "surface": "#0a0815",
      "primary": "#e8eaf5",
      "accent": "#a8a4c0",
      "text": "#e8eaf5",
      "subtext": "#5a5870",
      "divider": "#141220",
      "font": "var(--font-eb-garamond)",
      "headingFont": "var(--font-cinzel)",
      "heroGradient": "radial-gradient(ellipse at 50% 40%, #1a1530 0%, #0d0a1e 45%, #06050f 100%)"
    },
    "sections": ["hero", "story", "candle", "slideshow", "music", "video", "gift", "footer"],
    "animations": "dramatic",
    "effects": {
      "parallax": true,
      "particles": true
    }
  }'
)
ON CONFLICT (slug) DO UPDATE
SET renderer_config = EXCLUDED.renderer_config,
    name = EXCLUDED.name;

-- ─────────────────────────────────────────────────────────────

INSERT INTO templates (slug, name, tier, is_active, renderer_config)
VALUES (
  'in-loving-memory',
  'In Loving Memory',
  'premium',
  true,
  '{
    "slug": "in-loving-memory",
    "name": "In Loving Memory",
    "tier": "premium",
    "theme": {
      "background": "#080c14",
      "surface": "#0c1018",
      "primary": "#edf0f5",
      "accent": "#b0a8c8",
      "text": "#edf0f5",
      "subtext": "#606878",
      "divider": "#141820",
      "font": "var(--font-cormorant)",
      "headingFont": "var(--font-cormorant)",
      "heroGradient": "radial-gradient(ellipse at 50% 40%, #141c30 0%, #0c1020 55%, #080c14 100%)"
    },
    "sections": ["hero", "story", "candle", "gallery", "music", "gift", "footer"],
    "animations": "cinematic",
    "effects": {
      "filmGrain": true
    }
  }'
)
ON CONFLICT (slug) DO UPDATE
SET renderer_config = EXCLUDED.renderer_config,
    name = EXCLUDED.name;

-- ─────────────────────────────────────────────────────────────

INSERT INTO templates (slug, name, tier, is_active, renderer_config)
VALUES (
  'glass-and-gold',
  'Glass and Gold',
  'premium',
  true,
  '{
    "slug": "glass-and-gold",
    "name": "Glass and Gold",
    "tier": "premium",
    "theme": {
      "background": "#050808",
      "surface": "#080c0c",
      "primary": "#edf5f4",
      "accent": "#c9a96e",
      "text": "#edf5f4",
      "subtext": "#6a7070",
      "divider": "#10181a",
      "font": "var(--font-playfair)",
      "headingFont": "var(--font-cinzel)",
      "heroGradient": "linear-gradient(150deg, #05080a 0%, #050a0e 45%, #080810 100%)"
    },
    "sections": ["hero", "story", "gallery", "music", "countdown", "rsvp", "map", "guest_book", "gift", "footer"],
    "animations": "cinematic",
    "effects": {
      "filmGrain": true
    }
  }'
)
ON CONFLICT (slug) DO UPDATE
SET renderer_config = EXCLUDED.renderer_config,
    name = EXCLUDED.name;

-- ─────────────────────────────────────────────────────────────

INSERT INTO templates (slug, name, tier, is_active, renderer_config)
VALUES (
  'simple-invitation',
  'Simple Invitation',
  'basic',
  true,
  '{
    "slug": "simple-invitation",
    "name": "Simple Invitation",
    "tier": "basic",
    "theme": {
      "background": "#0e0c0a",
      "surface": "#141210",
      "primary": "#f5ede0",
      "accent": "#c4a882",
      "text": "#f5ede0",
      "subtext": "#7a6855",
      "divider": "#242018",
      "font": "var(--font-cormorant)",
      "headingFont": "var(--font-cormorant)",
      "heroGradient": "radial-gradient(ellipse at 50% 40%, #1c160e 0%, #0e0c0a 55%, #090806 100%)"
    },
    "sections": ["hero", "story", "map", "gift", "footer"],
    "animations": "minimal"
  }'
)
ON CONFLICT (slug) DO UPDATE
SET renderer_config = EXCLUDED.renderer_config,
    name = EXCLUDED.name;
