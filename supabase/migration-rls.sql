-- ─────────────────────────────────────────────
-- Enable RLS on all tables
-- ─────────────────────────────────────────────
ALTER TABLE users               ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages               ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders              ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_files         ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp_responses      ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_collaborators  ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals           ENABLE ROW LEVEL SECURITY;
ALTER TABLE tiers               ENABLE ROW LEVEL SECURITY;
ALTER TABLE duration_prices     ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates           ENABLE ROW LEVEL SECURITY;
ALTER TABLE discount_codes      ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_settings      ENABLE ROW LEVEL SECURITY;

-- ─────────────────────────────────────────────
-- TIERS — public read (needed for order wizard)
-- ─────────────────────────────────────────────
CREATE POLICY "tiers: public read"
  ON tiers FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────
-- DURATION PRICES — public read
-- ─────────────────────────────────────────────
CREATE POLICY "duration_prices: public read"
  ON duration_prices FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────
-- TEMPLATES — public read
-- ─────────────────────────────────────────────
CREATE POLICY "templates: public read"
  ON templates FOR SELECT
  USING (true);

-- ─────────────────────────────────────────────
-- DISCOUNT CODES — authenticated read only
-- (users need to validate codes at checkout)
-- ─────────────────────────────────────────────
CREATE POLICY "discount_codes: authenticated read"
  ON discount_codes FOR SELECT
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- ADMIN SETTINGS — authenticated read only
-- (payment method details shown on pay page)
-- ─────────────────────────────────────────────
CREATE POLICY "admin_settings: authenticated read"
  ON admin_settings FOR SELECT
  TO authenticated
  USING (true);

-- ─────────────────────────────────────────────
-- USERS
-- ─────────────────────────────────────────────
CREATE POLICY "users: read own row"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "users: update own row"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "users: insert own row"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- ─────────────────────────────────────────────
-- PAGES
-- ─────────────────────────────────────────────
CREATE POLICY "pages: read own"
  ON pages FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "pages: insert own"
  ON pages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "pages: update own"
  ON pages FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "pages: delete own"
  ON pages FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- Public pages are readable by anyone (for the /p/[slug] route)
CREATE POLICY "pages: public read if published"
  ON pages FOR SELECT
  USING (is_published = true);

-- ─────────────────────────────────────────────
-- ORDERS
-- ─────────────────────────────────────────────
CREATE POLICY "orders: read own"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "orders: insert own"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "orders: update own"
  ON orders FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ─────────────────────────────────────────────
-- MEDIA FILES
-- ─────────────────────────────────────────────
CREATE POLICY "media_files: read own"
  ON media_files FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "media_files: insert own"
  ON media_files FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "media_files: update own"
  ON media_files FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "media_files: delete own"
  ON media_files FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- ─────────────────────────────────────────────
-- RSVP RESPONSES
-- ─────────────────────────────────────────────

-- Anyone (including anonymous guests) can submit an RSVP
CREATE POLICY "rsvp_responses: public insert"
  ON rsvp_responses FOR INSERT
  WITH CHECK (true);

-- Page owner can read all RSVPs for their pages
CREATE POLICY "rsvp_responses: page owner read"
  ON rsvp_responses FOR SELECT
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

-- Page owner can delete RSVPs on their pages
CREATE POLICY "rsvp_responses: page owner delete"
  ON rsvp_responses FOR DELETE
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

-- ─────────────────────────────────────────────
-- PAGE COLLABORATORS
-- ─────────────────────────────────────────────

-- Page owner full access
CREATE POLICY "page_collaborators: owner read"
  ON page_collaborators FOR SELECT
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "page_collaborators: owner insert"
  ON page_collaborators FOR INSERT
  TO authenticated
  WITH CHECK (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "page_collaborators: owner update"
  ON page_collaborators FOR UPDATE
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "page_collaborators: owner delete"
  ON page_collaborators FOR DELETE
  TO authenticated
  USING (
    page_id IN (
      SELECT id FROM pages WHERE user_id = auth.uid()
    )
  );

-- Anyone with the invite_code can read and update their collaborator row
CREATE POLICY "page_collaborators: invite_code read"
  ON page_collaborators FOR SELECT
  USING (true);

CREATE POLICY "page_collaborators: invite_code update"
  ON page_collaborators FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- ─────────────────────────────────────────────
-- REFERRALS
-- ─────────────────────────────────────────────
CREATE POLICY "referrals: read own"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_id = auth.uid());

-- ─────────────────────────────────────────────
-- STORAGE: payment-screenshots
-- Run these in the Supabase SQL editor after
-- creating the bucket.
-- ─────────────────────────────────────────────

-- Users can upload to their own folder only (path: {userId}/...)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-screenshots', 'payment-screenshots', false)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "payment-screenshots: user upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'payment-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "payment-screenshots: user read own"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "payment-screenshots: user update own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'payment-screenshots'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
