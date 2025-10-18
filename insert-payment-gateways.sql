-- Insert payment gateways data
-- This script only inserts data, doesn't create tables

-- Clear existing data first (in case of duplicates)
DELETE FROM payment_gateways;

-- Insert default payment gateways
INSERT INTO payment_gateways (name, display_name, provider, is_active, is_default, mode, description, supported_currencies, supported_countries, fees_percentage, fees_fixed) VALUES
('stripe', 'Stripe', 'stripe', true, true, 'sandbox', 'Stripe payment processing', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB'], 2.90, 0.30),
('paypal', 'PayPal', 'paypal', false, false, 'sandbox', 'PayPal digital wallet', ARRAY['USD', 'EUR', 'GBP', 'CAD'], ARRAY['US', 'EU', 'GB', 'CA'], 2.90, 0.30),
('paystack', 'Paystack', 'paystack', false, false, 'sandbox', 'Paystack for Africa', ARRAY['NGN', 'GHS', 'ZAR'], ARRAY['NG', 'GH', 'ZA'], 1.50, 0.00),
('razorpay', 'Razorpay', 'razorpay', false, false, 'sandbox', 'Razorpay for India', ARRAY['INR'], ARRAY['IN'], 2.00, 0.00),
('iyzico', 'Iyzico', 'iyzico', false, false, 'sandbox', 'Turkish payment gateway', ARRAY['TRY'], ARRAY['TR'], 2.90, 0.30),
('cashfree', 'Cashfree', 'cashfree', false, false, 'sandbox', 'Cashfree for India', ARRAY['INR'], ARRAY['IN'], 2.00, 0.00),
('braintree', 'Braintree', 'braintree', false, false, 'sandbox', 'Braintree by PayPal', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB'], 2.90, 0.30),
('paytm', 'Paytm', 'paytm', false, false, 'sandbox', 'Paytm for India', ARRAY['INR'], ARRAY['IN'], 2.00, 0.00),
('payu', 'PayU', 'payu', false, false, 'sandbox', 'PayU for multiple countries', ARRAY['INR', 'TRY', 'PLN'], ARRAY['IN', 'TR', 'PL'], 2.90, 0.30),
('skrill', 'Skrill', 'skrill', false, false, 'sandbox', 'Skrill digital wallet', ARRAY['USD', 'EUR', 'GBP'], ARRAY['US', 'EU', 'GB'], 2.90, 0.30);

-- Verify the data was inserted
SELECT COUNT(*) as total_gateways FROM payment_gateways;
SELECT name, display_name, provider, is_active, is_default FROM payment_gateways ORDER BY is_default DESC, name;
