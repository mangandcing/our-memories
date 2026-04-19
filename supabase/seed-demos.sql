-- ─────────────────────────────────────────────────────────────
-- DEMO PAGES SEED
-- Run this after: schema.sql, seed.sql, seed-templates.sql,
-- migration-gallery.sql, migration-demo.sql
--
-- Creates a system demo user and 6 fully-populated demo pages.
-- Requires service role or superuser access (writes to auth.users).
-- ─────────────────────────────────────────────────────────────

-- 1. System demo user in auth.users
INSERT INTO auth.users (
  id, email, role, aud,
  created_at, updated_at, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data
)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@our-memories.store',
  'authenticated',
  'authenticated',
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Our Memories Demo"}'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Public profile
INSERT INTO public.users (id, email, full_name, referral_code)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'demo@our-memories.store',
  'Our Memories Demo',
  'DEMO0001'
)
ON CONFLICT (id) DO NOTHING;

-- 3. Six demo pages
INSERT INTO pages (
  id, user_id, template_id, tier_id,
  title, slug, status,
  is_published, demo, show_in_gallery,
  content
)
VALUES

-- ── Demo 1 ── Sarah & Joseph (Royal Wedding / Luxury / wedding_celebration) ──
(
  '00000001-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '30000001-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'Sarah & Joseph',
  'demo-sarah-joseph',
  'active', true, true, false,
  $json${
    "name1": "Sarah",
    "name2": "Joseph",
    "brideName": "Sarah",
    "groomName": "Joseph",
    "subtitle": "Two souls, one eternal story",
    "story": "It began at the Shwedagon Pagoda on a golden January evening — she was visiting Yangon for the first time, camera raised but not yet clicking, and he noticed the way she paused before lifting it, as if she wanted to see the moment first before capturing it.\n\nShe flew back to Edinburgh two days later, certain she would never see him again. Six months and a hundred letters later, she flew back. He brought her to that same spot at sunset, set the camera aside, and said: the picture I have been looking for is the one with you in it. She said yes before he finished the sentence.",
    "eventDate": "December 7, 2024",
    "countdownDate": "2024-12-07T18:00:00",
    "venueName": "",
    "venueAddress": "",
    "dresscode": "",
    "rsvpEnabled": false,
    "rsvpDeadline": "",
    "accessCode": ""
  }$json$::jsonb
),

-- ── Demo 2 ── Happy 30th, Amara (Milestone Birthday / Premium / birthday_wish) ──
(
  '00000002-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '20000002-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'Happy 30th, Amara',
  'demo-amara-30',
  'active', true, true, false,
  $json${
    "name1": "Amara",
    "name2": "",
    "subtitle": "Thirty years of grace, light, and love",
    "story": "Thirty years ago, a girl arrived in this world and immediately made everyone around her wonder what they had done with their time before she existed.\n\nAt thirty, Amara is someone who still asks questions before accepting answers, loves with intention, and has a quality of attention that makes everyone she talks to feel, for the length of the conversation, that they are the most interesting person in the world. Thirty is not a milestone. It is a beginning. Happy birthday, Amara.",
    "eventDate": "March 15, 2025",
    "countdownDate": "2025-03-15T00:00:00",
    "venueName": "",
    "venueAddress": "",
    "dresscode": "",
    "rsvpEnabled": false,
    "rsvpDeadline": "",
    "accessCode": ""
  }$json$::jsonb
),

-- ── Demo 3 ── You're Invited — David & Ming (Garden Romance / Premium / wedding_invitation) ──
(
  '00000003-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '20000003-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  'You''re Invited — David & Ming',
  'demo-david-ming',
  'active', true, true, false,
  $json${
    "name1": "David",
    "name2": "Ming",
    "brideName": "Ming",
    "groomName": "David",
    "subtitle": "Together with their families, they joyfully invite you",
    "story": "They met sheltering from rain in the same bookshop doorway in Mandalay — each pretending to check their phone, each actually stealing glances at the other's book.\n\nHe walked her to the restaurant she had been trying to reach for an hour, sat down without being invited, and she did not ask him to leave. Neither of them has stopped being surprised by the other since. Together with their families, David and Ming joyfully request your presence to celebrate their marriage on the twentieth of April, two thousand and twenty-five.",
    "eventDate": "April 20, 2025",
    "countdownDate": "2025-04-20T18:00:00",
    "venueName": "Grand Kandawgyi Palace",
    "venueAddress": "Kan Yeik Thar Road, Yangon",
    "dresscode": "Black Tie",
    "rsvpEnabled": true,
    "rsvpDeadline": "2025-03-31",
    "accessCode": ""
  }$json$::jsonb
),

-- ── Demo 4 ── In Memory of Ko Aung (Gentle Farewell / Basic / memorial_tribute) ──
(
  '00000004-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '10000005-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'In Memory of Ko Aung',
  'demo-ko-aung',
  'active', true, true, false,
  $json${
    "name1": "Ko Aung",
    "name2": "",
    "subtitle": "A life well lived, forever in our hearts",
    "story": "Ko Aung walked through this world for sixty-six years, and in all of them he was essentially the same person: unhurried, attentive, reliable in the way that a good piece of joinery is reliable — built to last, honest in its construction, better with age.\n\nHe ran his workshop on Strand Road for thirty-one years and made furniture the way some people tell the truth — without shortcuts, in a way meant to last. He taught eleven apprentices. He kept the same three jokes for forty years and laughed at every one of them every time. We miss him in small moments, constantly. We are grateful that he was ours.",
    "eventDate": "1958 — 2024",
    "countdownDate": "",
    "venueName": "",
    "venueAddress": "",
    "dresscode": "",
    "rsvpEnabled": false,
    "rsvpDeadline": "",
    "accessCode": ""
  }$json$::jsonb
),

-- ── Demo 5 ── A Letter For You, Maya (Eternal Devotion / Luxury / love_letter) ──
(
  '00000005-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '30000006-0000-0000-0000-000000000000',
  '33333333-3333-3333-3333-333333333333',
  'A Letter For You, Maya',
  'demo-maya-letter',
  'active', true, true, false,
  $json${
    "name1": "Maya",
    "name2": "",
    "subtitle": "Words I have been waiting to say",
    "story": "Maya, I have been trying to write this for a long time. I have started it perhaps thirty times, and every time the words come out too careful, or too much, or in the wrong order.\n\nI noticed the way you listen to people — the way you actually turn toward them when they speak, as if they might say something that matters and you do not want to miss it. The version of the future I imagine, the one that feels possible and right, you are at the center of it. I love you, and I mean every word.",
    "eventDate": "",
    "countdownDate": "",
    "venueName": "",
    "venueAddress": "",
    "dresscode": "",
    "rsvpEnabled": false,
    "rsvpDeadline": "",
    "accessCode": ""
  }$json$::jsonb
),

-- ── Demo 6 ── 10 Years of Us (Forever and Always / Premium / anniversary) ──
(
  '00000006-d000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',
  '20000004-0000-0000-0000-000000000000',
  '22222222-2222-2222-2222-222222222222',
  '10 Years of Us',
  'demo-10-years',
  'active', true, true, false,
  $json${
    "name1": "Thida",
    "name2": "Kyaw",
    "brideName": "Thida",
    "groomName": "Kyaw",
    "subtitle": "Ten years of choosing each other, every day",
    "story": "Ten years ago we stood in the small garden at your parents' house in Taunggyi, in November fog, and made promises we were too young to fully understand.\n\nThe ten years since have been larger and harder and stranger and richer than anything we pictured. But this has not changed: I would still choose you, knowing everything I know now — the difficult years, the ordinary ones we will one day miss. Happy anniversary. I love you more now than I did in that garden.",
    "eventDate": "November 12, 2015",
    "countdownDate": "",
    "venueName": "",
    "venueAddress": "",
    "dresscode": "",
    "rsvpEnabled": false,
    "rsvpDeadline": "",
    "accessCode": ""
  }$json$::jsonb
)

ON CONFLICT (slug) DO UPDATE SET
  content      = EXCLUDED.content,
  title        = EXCLUDED.title,
  is_published = EXCLUDED.is_published,
  demo         = EXCLUDED.demo;
