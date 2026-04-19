INSERT INTO templates (id, name, slug, tier_id, page_type, thumbnail_url, renderer_config, sort_order, is_active) VALUES

-- ─────────────────────────────────────────────────────────────
-- BASIC (10 templates)  tier_id = 11111111-1111-1111-1111-111111111111
-- ─────────────────────────────────────────────────────────────
(
  '10000001-0000-0000-0000-000000000000',
  'Classic Elegance',
  'classic-elegance',
  '11111111-1111-1111-1111-111111111111',
  'wedding_celebration',
  NULL, '{}', 1, true
),
(
  '10000002-0000-0000-0000-000000000000',
  'Golden Birthday',
  'golden-birthday',
  '11111111-1111-1111-1111-111111111111',
  'birthday_wish',
  NULL, '{}', 2, true
),
(
  '10000003-0000-0000-0000-000000000000',
  'Simple Invitation',
  'simple-invitation',
  '11111111-1111-1111-1111-111111111111',
  'wedding_invitation',
  NULL, '{}', 3, true
),
(
  '10000004-0000-0000-0000-000000000000',
  'Timeless Love',
  'timeless-love',
  '11111111-1111-1111-1111-111111111111',
  'anniversary',
  NULL, '{}', 4, true
),
(
  '10000005-0000-0000-0000-000000000000',
  'Gentle Farewell',
  'gentle-farewell',
  '11111111-1111-1111-1111-111111111111',
  'memorial_tribute',
  NULL, '{}', 5, true
),
(
  '10000006-0000-0000-0000-000000000000',
  'From the Heart',
  'from-the-heart',
  '11111111-1111-1111-1111-111111111111',
  'love_letter',
  NULL, '{}', 6, true
),
(
  '10000007-0000-0000-0000-000000000000',
  'Big Surprise',
  'big-surprise',
  '11111111-1111-1111-1111-111111111111',
  'gender_reveal',
  NULL, '{}', 7, true
),
(
  '10000008-0000-0000-0000-000000000000',
  'Celebrate With Us',
  'celebrate-with-us',
  '11111111-1111-1111-1111-111111111111',
  'birthday_invitation',
  NULL, '{}', 8, true
),
(
  '10000009-0000-0000-0000-000000000000',
  'You Are Invited',
  'you-are-invited',
  '11111111-1111-1111-1111-111111111111',
  'ceremony_invitation',
  NULL, '{}', 9, true
),
(
  '10000010-0000-0000-0000-000000000000',
  'Blank Canvas',
  'blank-canvas',
  '11111111-1111-1111-1111-111111111111',
  'custom_page',
  NULL, '{}', 10, true
),

-- ─────────────────────────────────────────────────────────────
-- PREMIUM (10 templates)  tier_id = 22222222-2222-2222-2222-222222222222
-- ─────────────────────────────────────────────────────────────
(
  '20000001-0000-0000-0000-000000000000',
  'Cinematic Wedding',
  'cinematic-wedding',
  '22222222-2222-2222-2222-222222222222',
  'wedding_celebration',
  NULL, '{}', 1, true
),
(
  '20000002-0000-0000-0000-000000000000',
  'Milestone Birthday',
  'milestone-birthday',
  '22222222-2222-2222-2222-222222222222',
  'birthday_wish',
  NULL, '{}', 2, true
),
(
  '20000003-0000-0000-0000-000000000000',
  'Garden Romance',
  'garden-romance',
  '22222222-2222-2222-2222-222222222222',
  'wedding_invitation',
  NULL, '{}', 3, true
),
(
  '20000004-0000-0000-0000-000000000000',
  'Forever and Always',
  'forever-and-always',
  '22222222-2222-2222-2222-222222222222',
  'anniversary',
  NULL, '{}', 4, true
),
(
  '20000005-0000-0000-0000-000000000000',
  'In Loving Memory',
  'in-loving-memory',
  '22222222-2222-2222-2222-222222222222',
  'memorial_tribute',
  NULL, '{}', 5, true
),
(
  '20000006-0000-0000-0000-000000000000',
  'Secret Admirer',
  'secret-admirer',
  '22222222-2222-2222-2222-222222222222',
  'love_letter',
  NULL, '{}', 6, true
),
(
  '20000007-0000-0000-0000-000000000000',
  'Pink or Blue',
  'pink-or-blue',
  '22222222-2222-2222-2222-222222222222',
  'gender_reveal',
  NULL, '{}', 7, true
),
(
  '20000008-0000-0000-0000-000000000000',
  'VIP Party',
  'vip-party',
  '22222222-2222-2222-2222-222222222222',
  'birthday_invitation',
  NULL, '{}', 8, true
),
(
  '20000009-0000-0000-0000-000000000000',
  'Grand Ceremony',
  'grand-ceremony',
  '22222222-2222-2222-2222-222222222222',
  'ceremony_invitation',
  NULL, '{}', 9, true
),
(
  '20000010-0000-0000-0000-000000000000',
  'Signature Page',
  'signature-page',
  '22222222-2222-2222-2222-222222222222',
  'custom_page',
  NULL, '{}', 10, true
),

-- ─────────────────────────────────────────────────────────────
-- LUXURY (10 templates)  tier_id = 33333333-3333-3333-3333-333333333333
-- ─────────────────────────────────────────────────────────────
(
  '30000001-0000-0000-0000-000000000000',
  'Royal Wedding',
  'royal-wedding',
  '33333333-3333-3333-3333-333333333333',
  'wedding_celebration',
  NULL, '{}', 1, true
),
(
  '30000002-0000-0000-0000-000000000000',
  'Luxury Birthday',
  'luxury-birthday',
  '33333333-3333-3333-3333-333333333333',
  'birthday_wish',
  NULL, '{}', 2, true
),
(
  '30000003-0000-0000-0000-000000000000',
  'Black Tie Affair',
  'black-tie-affair',
  '33333333-3333-3333-3333-333333333333',
  'wedding_invitation',
  NULL, '{}', 3, true
),
(
  '30000004-0000-0000-0000-000000000000',
  'Golden Anniversary',
  'golden-anniversary',
  '33333333-3333-3333-3333-333333333333',
  'anniversary',
  NULL, '{}', 4, true
),
(
  '30000005-0000-0000-0000-000000000000',
  'Eternal Tribute',
  'eternal-tribute',
  '33333333-3333-3333-3333-333333333333',
  'memorial_tribute',
  NULL, '{}', 5, true
),
(
  '30000006-0000-0000-0000-000000000000',
  'Eternal Devotion',
  'eternal-devotion',
  '33333333-3333-3333-3333-333333333333',
  'love_letter',
  NULL, '{}', 6, true
),
(
  '30000007-0000-0000-0000-000000000000',
  'Stardust Reveal',
  'stardust-reveal',
  '33333333-3333-3333-3333-333333333333',
  'gender_reveal',
  NULL, '{}', 7, true
),
(
  '30000008-0000-0000-0000-000000000000',
  'Exclusive Soiree',
  'exclusive-soiree',
  '33333333-3333-3333-3333-333333333333',
  'birthday_invitation',
  NULL, '{}', 8, true
),
(
  '30000009-0000-0000-0000-000000000000',
  'Prestige Ceremony',
  'prestige-ceremony',
  '33333333-3333-3333-3333-333333333333',
  'ceremony_invitation',
  NULL, '{}', 9, true
),
(
  '30000010-0000-0000-0000-000000000000',
  'Bespoke Creation',
  'bespoke-creation',
  '33333333-3333-3333-3333-333333333333',
  'custom_page',
  NULL, '{}', 10, true
)

ON CONFLICT (id) DO NOTHING;
