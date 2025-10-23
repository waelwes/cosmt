-- Turkish Payment Providers Migration
-- Add PayTR, VakıfBank, and Kuveyt Türk payment providers

-- Insert PayTR payment gateway
INSERT INTO payment_gateways (
  name,
  display_name,
  provider,
  is_active,
  is_default,
  mode,
  public_key,
  secret_key,
  merchant_id,
  webhook_secret,
  supported_currencies,
  supported_countries,
  fees_percentage,
  fees_fixed,
  api_url,
  webhook_url,
  description,
  logo_url,
  documentation_url,
  test_status,
  created_at,
  updated_at
) VALUES (
  'paytr',
  'PayTR',
  'paytr',
  false,
  false,
  'sandbox',
  '',
  '',
  '',
  '',
  ARRAY['TL', 'USD', 'EUR'],
  ARRAY['TR'],
  2.90,
  0.30,
  'https://www.paytr.com/odeme/api/get-token',
  '',
  'PayTR - Turkish payment gateway with credit card and bank transfer support',
  'https://www.paytr.com/img/logo.png',
  'https://www.paytr.com/odeme/entegrasyon',
  'pending',
  NOW(),
  NOW()
);

-- Insert VakıfBank payment gateway
INSERT INTO payment_gateways (
  name,
  display_name,
  provider,
  is_active,
  is_default,
  mode,
  public_key,
  secret_key,
  merchant_id,
  webhook_secret,
  supported_currencies,
  supported_countries,
  fees_percentage,
  fees_fixed,
  api_url,
  webhook_url,
  description,
  logo_url,
  documentation_url,
  test_status,
  created_at,
  updated_at
) VALUES (
  'vakifbank',
  'VakıfBank',
  'vakifbank',
  false,
  false,
  'sandbox',
  '',
  '',
  '',
  '',
  ARRAY['TL', 'USD', 'EUR'],
  ARRAY['TR'],
  2.50,
  0.25,
  'https://3dsecure.vakifbank.com.tr/',
  '',
  'VakıfBank - Turkish bank payment gateway with 3D Secure support',
  'https://www.vakifbank.com.tr/img/logo.png',
  'https://www.vakifbank.com.tr/kurumsal/sanal-pos',
  'pending',
  NOW(),
  NOW()
);

-- Insert Kuveyt Türk payment gateway
INSERT INTO payment_gateways (
  name,
  display_name,
  provider,
  is_active,
  is_default,
  mode,
  public_key,
  secret_key,
  merchant_id,
  webhook_secret,
  supported_currencies,
  supported_countries,
  fees_percentage,
  fees_fixed,
  api_url,
  webhook_url,
  description,
  logo_url,
  documentation_url,
  test_status,
  created_at,
  updated_at
) VALUES (
  'kuveytturk',
  'Kuveyt Türk',
  'kuveytturk',
  false,
  false,
  'sandbox',
  '',
  '',
  '',
  '',
  ARRAY['TL', 'USD', 'EUR'],
  ARRAY['TR'],
  2.75,
  0.35,
  'https://boa.kuveytturk.com.tr/sanalpos/',
  '',
  'Kuveyt Türk - Turkish bank payment gateway with installment support',
  'https://www.kuveytturk.com.tr/img/logo.png',
  'https://www.kuveytturk.com.tr/kurumsal/sanal-pos',
  'pending',
  NOW(),
  NOW()
);

-- Add Turkish payment provider specific columns if they don't exist
DO $$ 
BEGIN
    -- Add terminal_id column for VakıfBank and Kuveyt Türk
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_gateways' AND column_name = 'terminal_id') THEN
        ALTER TABLE payment_gateways ADD COLUMN terminal_id VARCHAR(255);
    END IF;
    
    -- Add password column for VakıfBank and Kuveyt Türk
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_gateways' AND column_name = 'password') THEN
        ALTER TABLE payment_gateways ADD COLUMN password VARCHAR(255);
    END IF;
    
    -- Add store_key column for Kuveyt Türk
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_gateways' AND column_name = 'store_key') THEN
        ALTER TABLE payment_gateways ADD COLUMN store_key VARCHAR(255);
    END IF;
    
    -- Add merchant_salt column for PayTR
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'payment_gateways' AND column_name = 'merchant_salt') THEN
        ALTER TABLE payment_gateways ADD COLUMN merchant_salt VARCHAR(255);
    END IF;
END $$;

-- Update existing payment gateways to have empty values for new columns
UPDATE payment_gateways 
SET 
  terminal_id = '',
  password = '',
  store_key = '',
  merchant_salt = ''
WHERE 
  terminal_id IS NULL OR 
  password IS NULL OR 
  store_key IS NULL OR 
  merchant_salt IS NULL;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_payment_gateways_provider ON payment_gateways(provider);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_active ON payment_gateways(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_mode ON payment_gateways(mode);

-- Add comments for documentation
COMMENT ON COLUMN payment_gateways.terminal_id IS 'Terminal ID for VakıfBank and Kuveyt Türk payment gateways';
COMMENT ON COLUMN payment_gateways.password IS 'Password for VakıfBank and Kuveyt Türk payment gateways';
COMMENT ON COLUMN payment_gateways.store_key IS 'Store Key for Kuveyt Türk payment gateway';
COMMENT ON COLUMN payment_gateways.merchant_salt IS 'Merchant Salt for PayTR payment gateway';
