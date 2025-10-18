-- Create payment_gateways table for managing multiple payment providers (Safe version)
-- This script handles existing objects gracefully

-- Create table if not exists
CREATE TABLE IF NOT EXISTS payment_gateways (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    display_name VARCHAR(100) NOT NULL,
    provider VARCHAR(50) NOT NULL, -- 'stripe', 'paypal', 'iyzico', etc.
    is_active BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false,
    mode VARCHAR(20) NOT NULL DEFAULT 'sandbox' CHECK (mode IN ('sandbox', 'live')),
    
    -- Credentials (encrypted in production)
    public_key TEXT,
    secret_key TEXT,
    merchant_id VARCHAR(100),
    webhook_secret TEXT,
    
    -- Configuration
    supported_currencies TEXT[] DEFAULT ARRAY['USD'],
    supported_countries TEXT[] DEFAULT ARRAY['US'],
    fees_percentage DECIMAL(5,2) DEFAULT 2.90,
    fees_fixed DECIMAL(10,2) DEFAULT 0.30,
    
    -- URLs
    api_url TEXT,
    webhook_url TEXT,
    
    -- Metadata
    description TEXT,
    logo_url TEXT,
    documentation_url TEXT,
    
    -- Status
    last_tested_at TIMESTAMP WITH TIME ZONE,
    test_status VARCHAR(20) DEFAULT 'pending' CHECK (test_status IN ('pending', 'success', 'failed')),
    test_error TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes only if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_gateways_provider') THEN
        CREATE INDEX idx_payment_gateways_provider ON payment_gateways(provider);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_gateways_active') THEN
        CREATE INDEX idx_payment_gateways_active ON payment_gateways(is_active);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_payment_gateways_mode') THEN
        CREATE INDEX idx_payment_gateways_mode ON payment_gateways(mode);
    END IF;
END $$;

-- Enable RLS (safe to run multiple times)
ALTER TABLE payment_gateways ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists, then create new one
DROP POLICY IF EXISTS "Allow all operations on payment_gateways for authenticated users" ON payment_gateways;
CREATE POLICY "Allow all operations on payment_gateways for authenticated users" 
    ON payment_gateways FOR ALL USING (auth.role() = 'authenticated');

-- Insert default payment gateways only if they don't exist
INSERT INTO payment_gateways (name, display_name, provider, is_active, is_default, mode, description, supported_currencies, supported_countries) 
SELECT * FROM (VALUES
    ('stripe', 'Stripe', 'stripe', true, true, 'sandbox', 'Stripe payment processing', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB']),
    ('paypal', 'PayPal', 'paypal', false, false, 'sandbox', 'PayPal digital wallet', ARRAY['USD', 'EUR', 'GBP', 'CAD'], ARRAY['US', 'EU', 'GB', 'CA']),
    ('paystack', 'Paystack', 'paystack', false, false, 'sandbox', 'Paystack for Africa', ARRAY['NGN', 'GHS', 'ZAR'], ARRAY['NG', 'GH', 'ZA']),
    ('razorpay', 'Razorpay', 'razorpay', false, false, 'sandbox', 'Razorpay for India', ARRAY['INR'], ARRAY['IN']),
    ('iyzico', 'Iyzico', 'iyzico', false, false, 'sandbox', 'Turkish payment gateway', ARRAY['TRY'], ARRAY['TR']),
    ('cashfree', 'Cashfree', 'cashfree', false, false, 'sandbox', 'Cashfree for India', ARRAY['INR'], ARRAY['IN']),
    ('braintree', 'Braintree', 'braintree', false, false, 'sandbox', 'Braintree by PayPal', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB']),
    ('paytm', 'Paytm', 'paytm', false, false, 'sandbox', 'Paytm for India', ARRAY['INR'], ARRAY['IN']),
    ('payu', 'PayU', 'payu', false, false, 'sandbox', 'PayU for multiple countries', ARRAY['INR', 'TRY', 'PLN'], ARRAY['IN', 'TR', 'PL']),
    ('skrill', 'Skrill', 'skrill', false, false, 'sandbox', 'Skrill digital wallet', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB'])
) AS v(name, display_name, provider, is_active, is_default, mode, description, supported_currencies, supported_countries)
WHERE NOT EXISTS (SELECT 1 FROM payment_gateways WHERE payment_gateways.name = v.name);

-- Create function to update updated_at timestamp (safe to run multiple times)
CREATE OR REPLACE FUNCTION update_payment_gateways_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists, then create new one
DROP TRIGGER IF EXISTS payment_gateways_updated_at ON payment_gateways;
CREATE TRIGGER payment_gateways_updated_at
    BEFORE UPDATE ON payment_gateways
    FOR EACH ROW
    EXECUTE FUNCTION update_payment_gateways_updated_at();
