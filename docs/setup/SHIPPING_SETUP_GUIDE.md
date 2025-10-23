# 🚚 **DHL Shipping Integration Setup Guide**

## 📋 **Prerequisites**

Before setting up the DHL shipping integration, ensure you have:

- ✅ **DHL eCommerce Account**: Register at [DHL eCommerce Developer Portal](https://developer.dhl.com/)
- ✅ **Supabase Project**: Database setup with migrations applied
- ✅ **Email Service**: SendGrid, AWS SES, or Resend account
- ✅ **Domain**: For webhook endpoints

## 🔧 **Environment Configuration**

Create a `.env.local` file in your project root with the following variables:

```bash
# Database Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# DHL eCommerce API Configuration
DHL_API_USERNAME=your_dhl_api_username
DHL_API_PASSWORD=your_dhl_api_password
DHL_ACCOUNT_NUMBER=your_dhl_account_number
DHL_API_ENDPOINT=https://api-eu.dhl.com
DHL_MODE=sandbox
DHL_WEBHOOK_SECRET=your_dhl_webhook_secret

# Yurtiçi Kargo API Configuration
YURTICI_API_KEY=your_yurtici_api_key
YURTICI_CUSTOMER_ID=your_yurtici_customer_id
YURTICI_API_ENDPOINT=https://api.yurticikargo.com.tr
YURTICI_MODE=sandbox

# PTT Kargo API Configuration
PTT_API_KEY=your_ptt_api_key
PTT_CUSTOMER_ID=your_ptt_customer_id
PTT_API_ENDPOINT=https://api.ptt.gov.tr
PTT_MODE=sandbox

# Email Service Configuration (SendGrid)
EMAIL_API_KEY=your_sendgrid_api_key
EMAIL_API_URL=https://api.sendgrid.com/v3/mail/send
EMAIL_FROM=noreply@cosmat.com

# Application Configuration
NEXT_PUBLIC_APP_URL=https://cosmat.com
NEXT_PUBLIC_APP_NAME=Cosmat
```

## 🗄️ **Database Setup**

### 1. Run Migrations

Execute the following SQL migrations in your Supabase database:

```bash
# Run shipping settings migration
psql -h your-db-host -U your-username -d your-database -f migrations/2025-01-20-shipping-settings.sql

# Run shipping integration migration
psql -h your-db-host -U your-username -d your-database -f migrations/2025-01-20-shipping-integration.sql
```

### 2. Verify Tables

Check that the following tables were created:
- `shipping_settings`
- `shipments`
- `shipment_events`
- `shipping_zones`
- `shipping_rates`

## 🔑 **DHL API Setup**

### 1. Get DHL Credentials

1. Visit [DHL eCommerce Developer Portal](https://developer.dhl.com/)
2. Create a new application
3. Get your API credentials:
   - **API Username**
   - **API Password**
   - **Account Number**
   - **API Endpoint** (choose based on your region)

### 2. Test API Connection

Use the admin panel to test your configuration:
1. Go to `/admin/settings/shipping`
2. Fill in your DHL credentials
3. Click "Test Configuration"
4. Verify the connection is successful

## 📧 **Email Service Setup**

### Option 1: SendGrid (Recommended)

1. Create account at [SendGrid](https://sendgrid.com/)
2. Generate API key
3. Set up domain authentication
4. Add to environment variables:

```bash
EMAIL_API_KEY=SG.your_sendgrid_api_key
EMAIL_API_URL=https://api.sendgrid.com/v3/mail/send
EMAIL_FROM=noreply@cosmat.com
```

### Option 2: AWS SES

1. Set up AWS SES in your region
2. Verify your domain
3. Create IAM user with SES permissions
4. Add to environment variables:

```bash
EMAIL_API_KEY=your_aws_access_key
EMAIL_API_URL=https://email.us-east-1.amazonaws.com
EMAIL_FROM=noreply@cosmat.com
```

### Option 3: Resend

1. Create account at [Resend](https://resend.com/)
2. Verify your domain
3. Get API key
4. Add to environment variables:

```bash
EMAIL_API_KEY=re_your_resend_api_key
EMAIL_API_URL=https://api.resend.com/emails
EMAIL_FROM=noreply@cosmat.com
```

## 🔗 **Webhook Setup**

### 1. Configure DHL Webhook

1. In your DHL developer account, set up webhook endpoint:
   - **URL**: `https://yourdomain.com/api/webhooks/dhl`
   - **Events**: Shipment status updates, delivery notifications

2. Add webhook secret to environment:

```bash
DHL_WEBHOOK_SECRET=your_webhook_secret_here
```

### 2. Test Webhook

Use DHL's webhook testing tools or create a test shipment to verify webhook functionality.

## 🚀 **Deployment**

### 1. Vercel Deployment

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy your application

### 2. Environment Variables in Production

Ensure all environment variables are set in your production environment:

```bash
# Required for production
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DHL_API_USERNAME=
DHL_API_PASSWORD=
DHL_ACCOUNT_NUMBER=
EMAIL_API_KEY=
EMAIL_FROM=
```

### 3. Database Migrations in Production

Run migrations on your production database:

```bash
# Using Supabase CLI
supabase db push

# Or using direct SQL
psql -h your-prod-db-host -U your-username -d your-database -f migrations/2025-01-20-shipping-settings.sql
psql -h your-prod-db-host -U your-username -d your-database -f migrations/2025-01-20-shipping-integration.sql
```

## 🧪 **Testing**

### 1. Test Shipping Rates

1. Go to checkout page
2. Add items to cart
3. Enter shipping address
4. Verify shipping rates are calculated

### 2. Test Shipment Creation

1. Place a test order
2. Go to admin panel
3. Create shipment for the order
4. Verify tracking number is generated

### 3. Test Email Notifications

1. Create a shipment
2. Check customer email for tracking notification
3. Verify email contains correct tracking information

### 4. Test Order Tracking

1. Go to customer profile
2. Click on order with tracking number
3. Verify tracking information is displayed

## 🔍 **Troubleshooting**

### Common Issues

#### 1. DHL API Authentication Failed
- Check API credentials
- Verify account is active
- Ensure correct API endpoint

#### 2. Email Not Sending
- Check email service configuration
- Verify API key is correct
- Check email service quotas

#### 3. Webhook Not Receiving Updates
- Verify webhook URL is accessible
- Check webhook secret configuration
- Test webhook endpoint manually

#### 4. Database Connection Issues
- Verify Supabase credentials
- Check database permissions
- Ensure migrations are applied

### Debug Mode

Enable debug logging by setting:

```bash
LOG_LEVEL=debug
```

## 📊 **Monitoring**

### 1. Check Logs

Monitor application logs for:
- API errors
- Email sending failures
- Webhook processing issues

### 2. Database Monitoring

Monitor database for:
- Failed shipments
- Missing tracking events
- Configuration errors

### 3. Email Delivery

Monitor email service for:
- Delivery rates
- Bounce rates
- Spam complaints

## 🔄 **Maintenance**

### 1. Regular Updates

- Update DHL API credentials if changed
- Monitor email service quotas
- Check webhook endpoint health

### 2. Backup

- Regular database backups
- Configuration backup
- Email template backups

### 3. Security

- Rotate API keys regularly
- Monitor webhook security
- Update dependencies

## 📞 **Support**

### DHL Support
- [DHL Developer Documentation](https://developer.dhl.com/)
- [DHL Support Portal](https://developer.dhl.com/support)

### Email Service Support
- **SendGrid**: [Support Center](https://support.sendgrid.com/)
- **AWS SES**: [AWS Support](https://aws.amazon.com/support/)
- **Resend**: [Help Center](https://resend.com/help)

### Application Support
- Check application logs
- Review error messages
- Contact development team

## ✅ **Verification Checklist**

- [ ] DHL API credentials configured
- [ ] Database migrations applied
- [ ] Email service configured
- [ ] Webhook endpoint accessible
- [ ] Test shipment created successfully
- [ ] Customer receives tracking email
- [ ] Order tracking works in customer profile
- [ ] Admin can manage shipments
- [ ] Production deployment successful
- [ ] All environment variables set

## 🎉 **You're All Set!**

Your DHL shipping integration is now ready to use. Customers can:
- See real-time shipping rates
- Receive tracking notifications
- Track orders in their profile
- Get updates via email

Admins can:
- Configure shipping settings
- Create and manage shipments
- Monitor order status
- Handle customer inquiries
