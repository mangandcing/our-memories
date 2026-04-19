CREATE TABLE IF NOT EXISTS guest_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  message text NOT NULL,
  approved boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS guest_messages_page_id_idx ON guest_messages(page_id);
CREATE INDEX IF NOT EXISTS guest_messages_approved_idx ON guest_messages(page_id, approved);

ALTER TABLE guest_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert guest messages"
  ON guest_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can read approved messages"
  ON guest_messages FOR SELECT
  TO anon, authenticated
  USING (approved = true);

CREATE POLICY "Service role has full access to guest_messages"
  ON guest_messages FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
