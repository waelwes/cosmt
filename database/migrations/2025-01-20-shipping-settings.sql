-- Create shipping_settings table
CREATE TABLE IF NOT EXISTS shipping_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    provider VARCHAR(50) NOT NULL,
    api_username VARCHAR(255),
    api_password VARCHAR(255),
    account_number VARCHAR(100),
    api_endpoint VARCHAR(500),
    mode VARCHAR(20) NOT NULL DEFAULT 'sandbox',
    enabled BOOLEAN NOT NULL DEFAULT true,
    
    -- Shipper Information
    shipper_name VARCHAR(255),
    contact_person VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    address1 VARCHAR(255),
    address2 VARCHAR(255),
    city VARCHAR(100),
    postal_code VARCHAR(20),
    country_code VARCHAR(3),
    
    -- Shipping Options
    default_service VARCHAR(100),
    label_format VARCHAR(10) DEFAULT 'PDF',
    weight_unit VARCHAR(5) DEFAULT 'kg',
    dimension_unit VARCHAR(5) DEFAULT 'cm',
    default_weight DECIMAL(8,3) DEFAULT 1.0,
    default_length DECIMAL(8,3) DEFAULT 10.0,
    default_width DECIMAL(8,3) DEFAULT 10.0,
    default_height DECIMAL(8,3) DEFAULT 10.0,
    
    -- Service Options
    insurance BOOLEAN DEFAULT false,
    signature_required BOOLEAN DEFAULT false,
    cod BOOLEAN DEFAULT false,
    
    -- Destination & Rate Settings
    allowed_countries TEXT[], -- Array of country codes
    handling_fee DECIMAL(10,2) DEFAULT 0.00,
    free_shipping_threshold DECIMAL(10,2) DEFAULT 0.00,
    
    -- Webhook & Real-time Settings
    webhook_url VARCHAR(500),
    realtime_rate BOOLEAN DEFAULT true,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on provider for faster lookups
CREATE INDEX IF NOT EXISTS idx_shipping_settings_provider ON shipping_settings(provider);

-- Create index on enabled status
CREATE INDEX IF NOT EXISTS idx_shipping_settings_enabled ON shipping_settings(enabled);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shipping_settings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER trigger_update_shipping_settings_updated_at
    BEFORE UPDATE ON shipping_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_shipping_settings_updated_at();

-- Insert default DHL configuration
INSERT INTO shipping_settings (
    provider,
    mode,
    enabled,
    shipper_name,
    contact_person,
    phone,
    email,
    address1,
    city,
    postal_code,
    country_code,
    default_service,
    label_format,
    weight_unit,
    dimension_unit,
    default_weight,
    default_length,
    default_width,
    default_height,
    insurance,
    signature_required,
    cod,
    allowed_countries,
    handling_fee,
    free_shipping_threshold,
    realtime_rate
) VALUES (
    'dhl',
    'sandbox',
    false,
    'Your Company Name',
    'Contact Person',
    '+1234567890',
    'shipping@yourcompany.com',
    '123 Business Street',
    'Business City',
    '12345',
    'US',
    'EXPRESS',
    'PDF',
    'kg',
    'cm',
    1.0,
    10.0,
    10.0,
    10.0,
    false,
    false,
    false,
    ARRAY['US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'AU'],
    0.00,
    100.00,
    true
) ON CONFLICT (provider) DO NOTHING;

-- Create RLS policies for security
ALTER TABLE shipping_settings ENABLE ROW LEVEL SECURITY;

-- Policy for authenticated users to read shipping settings
CREATE POLICY "Allow authenticated users to read shipping settings" ON shipping_settings
    FOR SELECT USING (auth.role() = 'authenticated');

-- Policy for authenticated users to update shipping settings
CREATE POLICY "Allow authenticated users to update shipping settings" ON shipping_settings
    FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy for authenticated users to insert shipping settings
CREATE POLICY "Allow authenticated users to insert shipping settings" ON shipping_settings
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');
