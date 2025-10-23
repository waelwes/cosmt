# 🇹🇷 Turkish Payment Gateway Setup Guide

## iyzico Payment Integration

Your e-commerce site is now integrated with iyzico, Turkey's leading payment gateway.

### ✅ What's Been Set Up

1. **iyzipay SDK** - Official iyzico JavaScript SDK installed
2. **Payment API** - Backend API routes for payment processing
3. **Checkout Integration** - Updated checkout page to use Turkish payment gateway
4. **Success/Cancel Pages** - Turkish language payment result pages
5. **Configuration** - Payment configuration system

### 🔧 Setup Steps

#### 1. Get iyzico Credentials

1. Visit [iyzico Developer Portal](https://dev.iyzipay.com/)
2. Create a merchant account
3. Get your API credentials:
   - API Key
   - Secret Key
   - Merchant ID

#### 2. Configure Environment Variables

Create a `.env.local` file in your project root:

```env
# iyzico Configuration
IYZICO_API_KEY=your_iyzico_api_key_here
IYZICO_SECRET_KEY=your_iyzico_secret_key_here
IYZICO_MERCHANT_ID=your_iyzico_merchant_id_here

# Environment (sandbox or production)
PAYMENT_ENVIRONMENT=sandbox

# Payment URLs (update with your domain)
PAYMENT_CALLBACK_URL=https://yourdomain.com/api/payment/callback
PAYMENT_RETURN_URL=https://yourdomain.com/checkout/success
PAYMENT_CANCEL_URL=https://yourdomain.com/checkout/cancel
```

#### 3. Test the Integration

1. **Sandbox Testing**: Use sandbox credentials for testing
2. **Test Cards**: iyzico provides test card numbers for sandbox
3. **Payment Flow**: Complete a test purchase to verify integration

### 🎯 Features Included

#### Payment Methods
- ✅ Credit Cards (Visa, Mastercard, American Express)
- ✅ Debit Cards
- ✅ Installment Payments (2, 3, 6, 9, 12 months)
- ✅ 3D Secure Authentication

#### Turkish Features
- ✅ Turkish Lira (TRY) currency
- ✅ Turkish language interface
- ✅ Local bank support
- ✅ Turkish address format

#### Security
- ✅ PCI DSS compliant
- ✅ 3D Secure authentication
- ✅ Fraud detection
- ✅ Secure tokenization

### 📱 Payment Flow

1. **Customer** adds items to cart
2. **Checkout** - Customer fills in information
3. **Payment** - Redirects to iyzico payment page
4. **3D Secure** - Bank authentication (if required)
5. **Success** - Redirects back to success page
6. **Callback** - Server verifies payment

### 🔄 API Endpoints

#### Create Payment
```
POST /api/payment/create
```
Creates a new payment and returns redirect URL.

#### Payment Callback
```
POST /api/payment/callback
```
Handles payment verification from iyzico.

### 🛠️ Customization

#### Payment Configuration
Edit `config/payment.ts` to customize:
- Installment options
- Payment methods
- Currency settings
- URLs

#### UI Customization
- Success page: `app/checkout/success/page.tsx`
- Cancel page: `app/checkout/cancel/page.tsx`
- Checkout page: `app/checkout/page.tsx`

### 🚀 Going Live

1. **Get Production Credentials** from iyzico
2. **Update Environment Variables** to production
3. **Test Thoroughly** with real cards
4. **Update URLs** to your production domain
5. **Enable SSL** (required for production)

### 📞 Support

- **iyzico Support**: [support.iyzico.com](https://support.iyzico.com)
- **Documentation**: [dev.iyzipay.com](https://dev.iyzipay.com)
- **API Reference**: [dev.iyzipay.com/api](https://dev.iyzipay.com/api)

### 🔒 Security Notes

- Never commit API keys to version control
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Regularly update dependencies
- Monitor payment logs

---

**Your Turkish payment gateway is ready! 🇹🇷**

Test it with sandbox credentials first, then go live with production credentials.
