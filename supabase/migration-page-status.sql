-- Add pending_review to page_status enum
ALTER TYPE page_status ADD VALUE IF NOT EXISTS 'pending_review';

-- Create page-media storage bucket (public for direct URL access)
INSERT INTO storage.buckets (id, name, public)
VALUES ('page-media', 'page-media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for page-media
CREATE POLICY "page-media: user upload"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'page-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "page-media: public read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'page-media');

CREATE POLICY "page-media: user update own"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'page-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "page-media: user delete own"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'page-media'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
