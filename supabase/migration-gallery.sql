-- Add gallery visibility column to pages
ALTER TABLE pages ADD COLUMN IF NOT EXISTS show_in_gallery boolean NOT NULL DEFAULT false;

-- Allow public (anonymous) read access to published gallery pages
CREATE POLICY "pages: public gallery read"
  ON pages FOR SELECT
  TO anon
  USING (is_published = true AND show_in_gallery = true);
