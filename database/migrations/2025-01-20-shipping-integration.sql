-- Enhanced shipping integration with existing database schema
-- This migration adds shipping-specific tables and enhances existing ones

-- 1. Create shipments table to track individual shipments
CREATE TABLE IF NOT EXISTS public.shipments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id VARCHAR NOT NULL,
    tracking_number VARCHAR NOT NULL UNIQUE,
    provider VARCHAR(50) NOT NULL,
    service VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'created',
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    label_url TEXT,
    tracking_url TEXT,
    estimated_delivery TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    weight DECIMAL(8,3),
    dimensions JSONB,
    insurance BOOLEAN DEFAULT false,
    signature_required BOOLEAN DEFAULT false,
    cod BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key to orders table
    CONSTRAINT shipments_order_id_fkey FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE
);

-- 2. Create shipment_events table for tracking history
CREATE TABLE IF NOT EXISTS public.shipment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipment_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    status VARCHAR(100) NOT NULL,
    description TEXT,
    location VARCHAR(255),
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key to shipments table
    CONSTRAINT shipment_events_shipment_id_fkey FOREIGN KEY (shipment_id) REFERENCES public.shipments(id) ON DELETE CASCADE
);

-- 3. Create shipping_zones table for regional shipping rules
CREATE TABLE IF NOT EXISTS public.shipping_zones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    countries TEXT[] NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create shipping_rates table for custom rate overrides
CREATE TABLE IF NOT EXISTS public.shipping_rates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zone_id UUID,
    provider VARCHAR(50) NOT NULL,
    service VARCHAR(100) NOT NULL,
    min_weight DECIMAL(8,3) DEFAULT 0,
    max_weight DECIMAL(8,3),
    min_value DECIMAL(10,2) DEFAULT 0,
    max_value DECIMAL(10,2),
    base_price DECIMAL(10,2) NOT NULL,
    per_kg_price DECIMAL(10,2) DEFAULT 0,
    handling_fee DECIMAL(10,2) DEFAULT 0,
    free_shipping_threshold DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Foreign key to shipping_zones table
    CONSTRAINT shipping_rates_zone_id_fkey FOREIGN KEY (zone_id) REFERENCES public.shipping_zones(id) ON DELETE CASCADE
);

-- 5. Add shipping-related columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_method VARCHAR(100),
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tracking_number VARCHAR(255),
ADD COLUMN IF NOT EXISTS shipping_zone_id UUID,
ADD COLUMN IF NOT EXISTS estimated_delivery TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipping_notes TEXT;

-- 6. Add foreign key for shipping zone
ALTER TABLE public.orders 
ADD CONSTRAINT orders_shipping_zone_id_fkey 
FOREIGN KEY (shipping_zone_id) REFERENCES public.shipping_zones(id);

-- 7. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON public.shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON public.shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_provider ON public.shipments(provider);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON public.shipments(status);
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON public.shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_timestamp ON public.shipment_events(timestamp);
CREATE INDEX IF NOT EXISTS idx_orders_tracking_number ON public.orders(tracking_number);
CREATE INDEX IF NOT EXISTS idx_orders_shipping_status ON public.orders(shipping_status);

-- 8. Create function to update shipment status and sync with orders
CREATE OR REPLACE FUNCTION update_shipment_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the corresponding order's shipping status
    UPDATE public.orders 
    SET 
        shipping_status = CASE 
            WHEN NEW.status = 'created' THEN 'preparing'
            WHEN NEW.status = 'shipped' THEN 'shipped'
            WHEN NEW.status = 'delivered' THEN 'delivered'
            WHEN NEW.status = 'returned' THEN 'returned'
            ELSE 'preparing'
        END,
        tracking_number = NEW.tracking_number,
        updated_at = NOW()
    WHERE id = NEW.order_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 9. Create trigger to automatically update order status when shipment status changes
CREATE TRIGGER trigger_update_shipment_status
    AFTER UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_shipment_status();

-- 10. Create function to update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 11. Create triggers for updated_at columns
CREATE TRIGGER trigger_update_shipments_updated_at
    BEFORE UPDATE ON public.shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_shipment_events_updated_at
    BEFORE UPDATE ON public.shipment_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_shipping_zones_updated_at
    BEFORE UPDATE ON public.shipping_zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_update_shipping_rates_updated_at
    BEFORE UPDATE ON public.shipping_rates
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 12. Insert default shipping zones
INSERT INTO public.shipping_zones (name, description, countries) VALUES
('North America', 'United States and Canada', ARRAY['US', 'CA']),
('Europe', 'European Union countries', ARRAY['GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI']),
('Asia Pacific', 'Asia and Pacific region', ARRAY['AU', 'JP', 'CN', 'IN', 'SG', 'HK', 'NZ', 'KR', 'TH', 'MY']),
('Middle East', 'Middle East and North Africa', ARRAY['AE', 'SA', 'EG', 'IL', 'JO', 'LB', 'KW', 'QA', 'BH', 'OM']),
('Rest of World', 'All other countries', ARRAY[]::text[]);

-- 13. Enable RLS on new tables
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_rates ENABLE ROW LEVEL SECURITY;

-- 14. Create RLS policies for shipments
CREATE POLICY "Allow authenticated users to read shipments" ON public.shipments
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert shipments" ON public.shipments
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update shipments" ON public.shipments
    FOR UPDATE USING (auth.role() = 'authenticated');

-- 15. Create RLS policies for shipment_events
CREATE POLICY "Allow authenticated users to read shipment_events" ON public.shipment_events
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to insert shipment_events" ON public.shipment_events
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- 16. Create RLS policies for shipping_zones
CREATE POLICY "Allow authenticated users to read shipping_zones" ON public.shipping_zones
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage shipping_zones" ON public.shipping_zones
    FOR ALL USING (auth.role() = 'authenticated');

-- 17. Create RLS policies for shipping_rates
CREATE POLICY "Allow authenticated users to read shipping_rates" ON public.shipping_rates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to manage shipping_rates" ON public.shipping_rates
    FOR ALL USING (auth.role() = 'authenticated');
