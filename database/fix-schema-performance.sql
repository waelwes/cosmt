-- Database Schema Performance Fixes
-- Run this script to improve your database performance

-- 1. Add missing indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_is_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_active_parent ON categories(is_active, parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 2. Add missing indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_child_category_id ON products(child_category_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_is_best_seller ON products(is_best_seller);
CREATE INDEX IF NOT EXISTS idx_products_is_on_sale ON products(is_on_sale);
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(status, category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);

-- 3. Add GIN indexes for array columns
CREATE INDEX IF NOT EXISTS idx_products_tags_gin ON products USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_products_related_gin ON products USING GIN(related_products);

-- 4. Add indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id_int);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_date ON orders(date);

-- 5. Add indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_product_id ON order_items(product_id);

-- 6. Add indexes for concerns
CREATE INDEX IF NOT EXISTS idx_concerns_type ON concerns(type);
CREATE INDEX IF NOT EXISTS idx_concerns_is_active ON concerns(is_active);

-- 7. Add indexes for product_concerns
CREATE INDEX IF NOT EXISTS idx_product_concerns_product_id ON product_concerns(product_id);
CREATE INDEX IF NOT EXISTS idx_product_concerns_concern_id ON product_concerns(concern_id);

-- 8. Add indexes for shipments
CREATE INDEX IF NOT EXISTS idx_shipments_order_id ON shipments(order_id);
CREATE INDEX IF NOT EXISTS idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX IF NOT EXISTS idx_shipments_status ON shipments(status);

-- 9. Add indexes for shipping_rates
CREATE INDEX IF NOT EXISTS idx_shipping_rates_zone_id ON shipping_rates(zone_id);
CREATE INDEX IF NOT EXISTS idx_shipping_rates_is_active ON shipping_rates(is_active);

-- 10. Add indexes for shipping_zones
CREATE INDEX IF NOT EXISTS idx_shipping_zones_is_active ON shipping_zones(is_active);

-- 11. Add indexes for user_profiles
CREATE INDEX IF NOT EXISTS idx_user_profiles_email ON user_profiles(email);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_status ON user_profiles(status);

-- 12. Add indexes for customers
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_customers_status ON customers(status);
CREATE INDEX IF NOT EXISTS idx_customers_tier ON customers(tier);

-- 13. Add indexes for payment_gateways
CREATE INDEX IF NOT EXISTS idx_payment_gateways_is_active ON payment_gateways(is_active);
CREATE INDEX IF NOT EXISTS idx_payment_gateways_is_default ON payment_gateways(is_default);

-- 14. Add indexes for shipment_events
CREATE INDEX IF NOT EXISTS idx_shipment_events_shipment_id ON shipment_events(shipment_id);
CREATE INDEX IF NOT EXISTS idx_shipment_events_timestamp ON shipment_events(timestamp);

-- 15. Update table statistics for better query planning
ANALYZE categories;
ANALYZE products;
ANALYZE orders;
ANALYZE order_items;
ANALYZE customers;
ANALYZE user_profiles;
ANALYZE concerns;
ANALYZE product_concerns;
ANALYZE shipments;
ANALYZE shipment_events;
ANALYZE shipping_zones;
ANALYZE shipping_rates;
ANALYZE payment_gateways;
