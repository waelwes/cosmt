import { DHLTrackingEmail, DHLTrackingEmailText } from '@/components/emails/DHLTrackingEmail';

interface TrackingNotificationData {
  customerEmail: string;
  customerName: string;
  orderNumber: string;
  dhlTrackingNumber: string;
  estimatedDelivery: string;
  orderItems: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    name: string;
    address1: string;
    address2?: string;
    city: string;
    postalCode: string;
    country: string;
  };
}

export class EmailService {
  private static instance: EmailService;
  private fromEmail: string;
  private apiKey: string;
  private apiUrl: string;

  private constructor() {
    this.fromEmail = process.env.EMAIL_FROM || 'noreply@cosmat.com';
    this.apiKey = process.env.EMAIL_API_KEY || '';
    this.apiUrl = process.env.EMAIL_API_URL || 'https://api.sendgrid.com/v3/mail/send';
  }

  public static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  // Send DHL tracking notification email
  async sendDHLTrackingNotification(data: TrackingNotificationData): Promise<boolean> {
    try {
      const trackingUrl = `https://www.dhl.com/tracking?trackingNumber=${data.dhlTrackingNumber}`;
      
      const emailData = {
        to: data.customerEmail,
        from: this.fromEmail,
        subject: `🚚 Your Order is On Its Way! - DHL Tracking #${data.dhlTrackingNumber}`,
        html: this.generateHTMLContent({ ...data, trackingUrl }),
        text: DHLTrackingEmailText({ ...data, trackingUrl })
      };

      const response = await this.sendEmail(emailData);
      
      if (response.success) {
        console.log(`DHL tracking email sent successfully to ${data.customerEmail}`);
        return true;
      } else {
        console.error('Failed to send DHL tracking email:', response.error);
        return false;
      }
    } catch (error) {
      console.error('Error sending DHL tracking email:', error);
      return false;
    }
  }

  private generateHTMLContent(data: TrackingNotificationData & { trackingUrl: string }): string {
    // This would typically use a template engine like Handlebars or React Server Components
    // For now, we'll create a simple HTML template
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Order Tracking Information</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <!-- Header -->
          <div style="background-color: #00514B; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">🚚 Your Order is On Its Way!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">DHL Tracking Information</p>
          </div>

          <!-- Main Content -->
          <div style="background-color: #f8f9fa; padding: 30px; border: 1px solid #e9ecef; border-radius: 0 0 8px 8px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Hello <strong>${data.customerName}</strong>,
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Great news! Your order has been shipped and is on its way to you. Here are the tracking details:
            </p>

            <!-- Tracking Information Card -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; border: 2px solid #00514B; margin-bottom: 20px;">
              <h2 style="color: #00514B; margin-top: 0; font-size: 20px;">📦 Tracking Information</h2>
              
              <div style="margin-bottom: 15px;">
                <strong>Order Number:</strong> ${data.orderNumber}
              </div>
              
              <div style="margin-bottom: 15px;">
                <strong>DHL Tracking Number:</strong> 
                <span style="background-color: #00514B; color: white; padding: 4px 8px; border-radius: 4px; margin-left: 8px; font-family: monospace; font-size: 14px;">
                  ${data.dhlTrackingNumber}
                </span>
              </div>
              
              <div style="margin-bottom: 20px;">
                <strong>Estimated Delivery:</strong> ${data.estimatedDelivery}
              </div>
              
              <div style="text-align: center; margin-top: 20px;">
                <a href="${data.trackingUrl}" 
                   style="background-color: #00514B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
                  Track Your Package
                </a>
              </div>
            </div>

            <!-- Order Items -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #00514B; margin-top: 0;">📦 Order Items</h3>
              ${data.orderItems.map(item => `
                <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee;">
                  <span>${item.name} × ${item.quantity}</span>
                  <span><strong>$${item.price.toFixed(2)}</strong></span>
                </div>
              `).join('')}
            </div>

            <!-- Shipping Address -->
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #00514B; margin-top: 0;">📍 Shipping Address</h3>
              <div style="line-height: 1.6;">
                <div><strong>${data.shippingAddress.name}</strong></div>
                <div>${data.shippingAddress.address1}</div>
                ${data.shippingAddress.address2 ? `<div>${data.shippingAddress.address2}</div>` : ''}
                <div>${data.shippingAddress.city}, ${data.shippingAddress.postalCode}</div>
                <div>${data.shippingAddress.country}</div>
              </div>
            </div>

            <!-- Additional Information -->
            <div style="background-color: #e8f5e8; padding: 20px; border-radius: 8px; border-left: 4px solid #00514B;">
              <h3 style="color: #00514B; margin-top: 0;">📱 Additional Tracking Options</h3>
              <ul style="margin: 0; padding-left: 20px;">
                <li>Track directly on DHL website using tracking number: <strong>${data.dhlTrackingNumber}</strong></li>
                <li>Check your account profile for order status updates</li>
                <li>Download the DHL mobile app for push notifications</li>
              </ul>
            </div>

            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                Questions about your order? Contact us at 
                <a href="mailto:support@cosmat.com" style="color: #00514B;">support@cosmat.com</a>
              </p>
              <p style="color: #666; font-size: 14px; margin: 10px 0 0 0;">
                Thank you for choosing Cosmat! 🙏
              </p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  // Generic email sending method
  private async sendEmail(emailData: any): Promise<{ success: boolean; error?: string }> {
    try {
      // Check if we have API credentials
      if (!this.apiKey) {
        console.warn('Email API key not configured. Email sending disabled.');
        return { success: false, error: 'Email service not configured' };
      }

      // Use SendGrid API (or replace with your preferred email service)
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{
            to: [{ email: emailData.to }],
            subject: emailData.subject
          }],
          from: { email: emailData.from },
          content: [
            {
              type: 'text/plain',
              value: emailData.text
            },
            {
              type: 'text/html',
              value: emailData.html
            }
          ]
        })
      });

      if (response.ok) {
        return { success: true };
      } else {
        const errorData = await response.text();
        return { 
          success: false, 
          error: `Email service error: ${response.status} - ${errorData}` 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  }

  // Method to send order status updates
  async sendOrderStatusUpdate(
    customerEmail: string,
    customerName: string,
    orderNumber: string,
    status: string,
    trackingNumber?: string
  ): Promise<boolean> {
    try {
      const subject = `Order ${orderNumber} Status Update: ${status}`;
      const htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #00514B;">Order Status Update</h2>
          <p>Hello ${customerName},</p>
          <p>Your order <strong>${orderNumber}</strong> status has been updated to: <strong>${status}</strong></p>
          ${trackingNumber ? `<p>Tracking Number: <strong>${trackingNumber}</strong></p>` : ''}
          <p>You can track your order in your account profile or contact us if you have any questions.</p>
          <p>Thank you for your business!</p>
        </div>
      `;

      const emailData = {
        to: customerEmail,
        from: this.fromEmail,
        subject,
        html: htmlContent,
        text: `Order ${orderNumber} Status Update: ${status}${trackingNumber ? `\nTracking Number: ${trackingNumber}` : ''}`
      };

      const response = await this.sendEmail(emailData);
      return response.success;
    } catch (error) {
      console.error('Error sending order status update:', error);
      return false;
    }
  }
}

export default EmailService;