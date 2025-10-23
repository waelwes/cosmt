# DHL eCommerce API Integration

A comprehensive shipping module built with TypeScript, following SOLID principles and the Abstract Factory pattern for easy extensibility.

## 🏗️ Architecture Overview

### Backend Structure
```
lib/shipping/
├── interfaces/
│   ├── IShippingProvider.ts    # Base interface for all shipping providers
│   └── IShippingConfig.ts      # Configuration interfaces
├── providers/
│   └── DHLProvider.ts          # DHL eCommerce implementation
├── factories/
│   └── ShippingFactory.ts      # Abstract Factory for creating providers
└── services/
    └── ShippingService.ts      # High-level service layer
```

### API Endpoints
```
/api/shipping/
├── settings/                   # Manage shipping provider settings
├── rates/                      # Calculate shipping rates
├── shipments/                  # Create shipments
├── tracking/                   # Track shipments
└── validate/                   # Validate provider configuration
```

## 🚀 Features

### ✅ Implemented
- **DHL eCommerce Integration**: Full API integration with rate calculation, shipment creation, and tracking
- **SOLID Principles**: Clean, maintainable code following SOLID principles
- **Abstract Factory Pattern**: Easy to add new shipping providers
- **Admin Dashboard**: Complete settings management interface
- **Database Integration**: PostgreSQL/Supabase schema for settings storage
- **TypeScript**: Full type safety throughout the system
- **React Components**: Reusable UI components for checkout and admin

### 🔄 Coming Soon
- **FedEx Integration**: Express and ground shipping
- **Aramex Integration**: Middle East and global shipping
- **UPS Integration**: Worldwide shipping options
- **Real-time Tracking**: Webhook integration for live updates

## 📦 Installation & Setup

### 1. Database Setup
Run the migration to create the shipping settings table:

```sql
-- Run this migration
\i migrations/2025-01-20-shipping-settings.sql
```

### 2. Environment Variables
Add your DHL eCommerce API credentials to your environment:

```env
DHL_API_USERNAME=your_username
DHL_API_PASSWORD=your_password
DHL_ACCOUNT_NUMBER=your_account_number
DHL_API_ENDPOINT=https://api-eu.dhl.com
```

### 3. DHL API Setup
1. Register for DHL eCommerce API access
2. Get your API credentials from DHL
3. Configure the settings in the admin dashboard

## 🎯 Usage Examples

### Basic Rate Calculation
```typescript
import { ShippingService } from '@/lib/shipping/services/ShippingService';
import { ShippingOrder } from '@/lib/shipping/interfaces/IShippingProvider';

const shippingService = new ShippingService('dhl', dhlConfig);

const order: ShippingOrder = {
  orderId: 'ORDER-123',
  from: { /* shipper address */ },
  to: { /* recipient address */ },
  packages: [{
    weight: 1.0,
    length: 10.0,
    width: 10.0,
    height: 10.0,
    weightUnit: 'kg',
    dimensionUnit: 'cm'
  }],
  value: 100.00,
  currency: 'USD'
};

const rates = await shippingService.getRates(order);
```

### Creating a Shipment
```typescript
const shipment = await shippingService.createShipment(order);
console.log('Tracking Number:', shipment.trackingNumber);
console.log('Label URL:', shipment.labelUrl);
```

### Tracking a Shipment
```typescript
const tracking = await shippingService.trackShipment('TRACK123456');
console.log('Status:', tracking.status);
console.log('Location:', tracking.location);
```

### Using the React Hook
```typescript
import { useShipping } from '@/hooks/useShipping';

function CheckoutComponent() {
  const { 
    loading, 
    rates, 
    calculateRates, 
    createShipment 
  } = useShipping();

  const handleCalculateRates = async () => {
    await calculateRates(order);
  };

  const handleCreateShipment = async () => {
    await createShipment(order);
  };

  return (
    <div>
      <button onClick={handleCalculateRates}>
        Calculate Rates
      </button>
      {rates.map(rate => (
        <div key={rate.service}>
          {rate.serviceName}: ${rate.price}
        </div>
      ))}
    </div>
  );
}
```

## 🔧 Admin Configuration

### Accessing Shipping Settings
Navigate to: `http://localhost:3000/admin/settings/shipping`

### Configuration Sections

#### 1. API Credentials
- API Username
- API Password
- Account Number
- API Endpoint
- Mode (Sandbox/Production)

#### 2. Shipper Information
- Company Name
- Contact Person
- Phone & Email
- Complete Address

#### 3. Shipping Options
- Default Service
- Label Format (PDF/PNG/ZPL)
- Weight/Dimension Units
- Default Package Dimensions
- Service Options (Insurance, Signature, COD)

#### 4. Destinations & Rates
- Allowed Countries
- Handling Fee
- Free Shipping Threshold
- Webhook URL
- Real-time Rate Calculation

## 🏭 Adding New Shipping Providers

### 1. Create Provider Interface
```typescript
// lib/shipping/interfaces/FedExConfig.ts
export interface FedExConfig extends BaseShippingConfig {
  provider: 'fedex';
  apiKey: string;
  meterNumber: string;
  // ... other FedEx specific fields
}
```

### 2. Implement Provider
```typescript
// lib/shipping/providers/FedExProvider.ts
export class FedExProvider implements IShippingProvider {
  // Implement all required methods
}
```

### 3. Update Factory
```typescript
// lib/shipping/factories/ShippingFactory.ts
static create(providerName: string, config: ShippingConfig): IShippingProvider {
  switch (providerName.toLowerCase()) {
    case 'dhl':
      return new DHLProvider(config as DHLConfig);
    case 'fedex':
      return new FedExProvider(config as FedExConfig);
    // ... other providers
  }
}
```

### 4. Add Database Migration
```sql
-- Add FedEx specific columns to shipping_settings table
ALTER TABLE shipping_settings ADD COLUMN api_key VARCHAR(255);
ALTER TABLE shipping_settings ADD COLUMN meter_number VARCHAR(100);
-- ... other FedEx fields
```

## 🧪 Testing

### Unit Tests
```bash
npm test -- --testPathPattern=shipping
```

### Integration Tests
```bash
npm test -- --testPathPattern=api/shipping
```

### Manual Testing
1. Configure DHL settings in admin dashboard
2. Test rate calculation with sample orders
3. Create test shipments
4. Verify tracking functionality

## 📊 API Reference

### Calculate Rates
```http
POST /api/shipping/rates
Content-Type: application/json

{
  "provider": "dhl",
  "order": {
    "orderId": "ORDER-123",
    "from": { /* shipper address */ },
    "to": { /* recipient address */ },
    "packages": [/* package details */],
    "value": 100.00,
    "currency": "USD"
  }
}
```

### Create Shipment
```http
POST /api/shipping/shipments
Content-Type: application/json

{
  "provider": "dhl",
  "order": { /* order details */ }
}
```

### Track Shipment
```http
GET /api/shipping/tracking?trackingNumber=TRACK123&provider=dhl
```

### Get Settings
```http
GET /api/shipping/settings?provider=dhl
```

### Save Settings
```http
POST /api/shipping/settings
Content-Type: application/json

{
  "provider": "dhl",
  "api_username": "your_username",
  "api_password": "your_password",
  // ... other settings
}
```

## 🔒 Security Considerations

- API credentials are stored encrypted in the database
- All API calls use HTTPS
- Input validation on all endpoints
- Rate limiting on API endpoints
- Row Level Security (RLS) enabled on database tables

## 🚨 Error Handling

The system includes comprehensive error handling:

- **API Errors**: Proper error messages from shipping providers
- **Validation Errors**: Input validation with clear error messages
- **Network Errors**: Retry logic and fallback mechanisms
- **Configuration Errors**: Clear guidance for setup issues

## 📈 Performance

- **Caching**: Rate calculations are cached for identical requests
- **Async Operations**: Non-blocking API calls
- **Connection Pooling**: Efficient database connections
- **Error Recovery**: Graceful degradation on failures

## 🤝 Contributing

1. Follow the existing code structure
2. Add tests for new features
3. Update documentation
4. Follow TypeScript best practices
5. Ensure SOLID principles compliance

## 📝 License

This shipping integration is part of the COSMT e-commerce platform and follows the same licensing terms.

## 🆘 Support

For issues or questions:
1. Check the admin dashboard configuration
2. Review API logs for errors
3. Verify DHL API credentials
4. Contact support with specific error messages

---

**Built with ❤️ for the COSMT e-commerce platform**
