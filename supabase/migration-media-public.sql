-- Allow anonymous users to read media files for published pages.
-- Without this policy, the media join in /p/[slug] returns [] for all visitors
-- because media_files has RLS enabled but only had an authenticated-owner policy.

CREATE POLICY "media_files: public read if page published"
  ON media_files FOR SELECT
  USING (
    page_id IN (
      SELECT id FROM pages WHERE is_published = true
    )
  );
