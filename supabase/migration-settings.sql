CREATE TABLE admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER admin_settings_updated_at
  BEFORE UPDATE ON admin_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

INSERT INTO admin_settings (key, value) VALUES
  ('kbz_pay_phone',       '09-xxx-xxx-xxx'),
  ('kbz_pay_qr_url',      ''),
  ('wave_money_phone',    '09-xxx-xxx-xxx'),
  ('aya_pay_phone',       '09-xxx-xxx-xxx'),
  ('bangkok_bank_qr_url', ''),
  ('true_money_phone',    '09-xxx-xxx-xxx')
ON CONFLICT (key) DO NOTHING;
