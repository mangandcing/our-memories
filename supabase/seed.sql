INSERT INTO tiers (id, name, features, sort_order, is_active) VALUES
  (
    '11111111-1111-1111-1111-111111111111',
    'Basic',
    '["Story section", "Text content", "Gift section", "10+ templates", "QR code"]',
    1,
    true
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Premium',
    '["Everything in Basic", "Photo gallery (50MB)", "Background music", "Countdown timer", "PDF export", "20+ templates"]',
    2,
    true
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Luxury',
    '["Everything in Premium", "Full-screen video", "Interactive games", "Collaboration", "Custom domain", "Priority review", "30 templates"]',
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;

INSERT INTO duration_prices (id, tier_id, duration_months, price, label, is_active) VALUES
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    0,
    15000,
    'Lifetime',
    true
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '22222222-2222-2222-2222-222222222222',
    0,
    35000,
    'Lifetime',
    true
  ),
  (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '33333333-3333-3333-3333-333333333333',
    0,
    65000,
    'Lifetime',
    true
  )
ON CONFLICT (id) DO NOTHING;
