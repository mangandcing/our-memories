CREATE TYPE page_type AS ENUM (
  'wedding_celebration',
  'birthday_wish',
  'wedding_invitation',
  'anniversary',
  'memorial_tribute',
  'love_letter',
  'gender_reveal',
  'birthday_invitation',
  'ceremony_invitation',
  'custom_page'
);

CREATE TYPE page_status AS ENUM ('draft', 'active', 'expired');
CREATE TYPE order_status AS ENUM ('pending', 'approved', 'rejected');
CREATE TYPE payment_method AS ENUM ('kbz_pay', 'wave_money', 'aya_pay', 'bangkok_bank_qr', 'true_money');
CREATE TYPE media_type AS ENUM ('photo', 'video', 'audio');
CREATE TYPE rsvp_status AS ENUM ('attending', 'not_attending', 'maybe');
CREATE TYPE discount_type AS ENUM ('percentage', 'fixed');
CREATE TYPE referral_status AS ENUM ('pending', 'credited');

CREATE TABLE tiers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  features jsonb NOT NULL DEFAULT '[]',
  sort_order int NOT NULL,
  is_active bool NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  referral_code text UNIQUE NOT NULL,
  referred_by uuid REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE duration_prices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tier_id uuid NOT NULL REFERENCES tiers(id) ON DELETE CASCADE,
  duration_months int NOT NULL DEFAULT 0,
  price numeric NOT NULL,
  label text NOT NULL,
  is_active bool NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  tier_id uuid NOT NULL REFERENCES tiers(id),
  page_type page_type NOT NULL,
  thumbnail_url text,
  renderer_config jsonb NOT NULL DEFAULT '{}',
  sort_order int NOT NULL,
  is_active bool NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type discount_type NOT NULL,
  value numeric NOT NULL,
  min_order_amount numeric,
  max_uses int,
  used_count int NOT NULL DEFAULT 0,
  is_active bool NOT NULL DEFAULT true,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id uuid NOT NULL REFERENCES templates(id),
  tier_id uuid NOT NULL REFERENCES tiers(id),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  status page_status NOT NULL DEFAULT 'draft',
  content jsonb NOT NULL DEFAULT '{}',
  settings jsonb NOT NULL DEFAULT '{}',
  view_count int NOT NULL DEFAULT 0,
  is_published bool NOT NULL DEFAULT false,
  gift_enabled bool NOT NULL DEFAULT false,
  gift_qr_url text,
  gift_phone text,
  gift_note text,
  custom_domain text,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  page_id uuid NOT NULL REFERENCES pages(id),
  tier_id uuid NOT NULL REFERENCES tiers(id),
  duration_price_id uuid REFERENCES duration_prices(id),
  amount numeric NOT NULL,
  currency text NOT NULL DEFAULT 'MMK',
  payment_method payment_method NOT NULL,
  screenshot_url text NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  admin_note text,
  discount_code_id uuid REFERENCES discount_codes(id),
  discount_amount numeric NOT NULL DEFAULT 0,
  reviewed_by uuid REFERENCES users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE media_files (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id),
  type media_type NOT NULL,
  storage_path text NOT NULL,
  url text NOT NULL,
  file_name text NOT NULL,
  file_size int NOT NULL,
  mime_type text NOT NULL,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE rsvp_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  name text NOT NULL,
  phone text,
  email text,
  status rsvp_status NOT NULL,
  guest_count int NOT NULL DEFAULT 1,
  message text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE page_collaborators (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  invite_code text UNIQUE NOT NULL,
  name text NOT NULL,
  assigned_sections jsonb NOT NULL DEFAULT '[]',
  is_complete bool NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id),
  referred_id uuid NOT NULL REFERENCES users(id),
  order_id uuid REFERENCES orders(id),
  reward_amount numeric,
  status referral_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX ON pages(user_id);
CREATE INDEX ON pages(slug);
CREATE INDEX ON pages(status);
CREATE INDEX ON orders(user_id);
CREATE INDEX ON orders(page_id);
CREATE INDEX ON orders(status);
CREATE INDEX ON media_files(page_id);
CREATE INDEX ON rsvp_responses(page_id);
CREATE INDEX ON page_collaborators(page_id);
CREATE INDEX ON page_collaborators(invite_code);
CREATE INDEX ON referrals(referrer_id);
CREATE INDEX ON referrals(referred_id);
CREATE INDEX ON duration_prices(tier_id);
CREATE INDEX ON templates(tier_id);
CREATE INDEX ON templates(page_type);

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
