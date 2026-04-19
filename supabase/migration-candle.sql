ALTER TABLE pages ADD COLUMN IF NOT EXISTS candle_count integer NOT NULL DEFAULT 0;

CREATE OR REPLACE FUNCTION increment_candle_count(p_page_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE pages SET candle_count = candle_count + 1 WHERE id = p_page_id RETURNING candle_count INTO new_count;
  RETURN COALESCE(new_count, 0);
END;
$$;
