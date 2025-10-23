import React from 'react';

interface DHLTrackingEmailProps {
  customerName: string;
  orderNumber: string;
  dhlTrackingNumber: string;
  estimatedDelivery: string;
  trackingUrl: string;
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

export default function DHLTrackingEmail({
  customerName,
  orderNumber,
  dhlTrackingNumber,
  estimatedDelivery,
  trackingUrl,
  orderItems,
  shippingAddress
}: DHLTrackingEmailProps) {
  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <div style={{ 
        backgroundColor: '#00514B', 
        color: 'white', 
        padding: '20px', 
        textAlign: 'center',
        borderRadius: '8px 8px 0 0'
      }}>
        <h1 style={{ margin: 0, fontSize: '24px' }}>🚚 Your Order is On Its Way!</h1>
        <p style={{ margin: '10px 0 0 0', fontSize: '16px', opacity: 0.9 }}>
          DHL Tracking Information
        </p>
      </div>

      {/* Main Content */}
      <div style={{ 
        backgroundColor: '#f8f9fa', 
        padding: '30px', 
        border: '1px solid #e9ecef',
        borderRadius: '0 0 8px 8px'
      }}>
        {/* Greeting */}
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          Hello <strong>{customerName}</strong>,
        </p>
        
        <p style={{ fontSize: '16px', marginBottom: '20px' }}>
          Great news! Your order has been shipped and is on its way to you. Here are the tracking details:
        </p>

        {/* Tracking Information Card */}
        <div style={{ 
          backgroundColor: 'white', 
          padding: '20px', 
          borderRadius: '8px', 
          border: '2px solid #00514B',
          marginBottom: '20px'
        }}>
          <h2 style={{ color: '#00514B', marginTop: 0, fontSize: '20px' }}>
            📦 Tracking Information
          </h2>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Order Number:</strong> {orderNumber}
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>DHL Tracking Number:</strong> 
            <span style={{ 
              backgroundColor: '#00514B', 
              color: 'white', 
              padding: '4px 8px', 
              borderRadius: '4px',
              marginLeft: '8px',
              fontFamily: 'monospace',
              fontSize: '14px'
            }}>
              {dhlTrackingNumber}
            </span>
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Estimated Delivery:</strong> {estimatedDelivery}
          </div>
          
          {/* Track Button */}
          <div style={{ marginTop: '20px' }}>
            <a 
              href={trackingUrl} 
              style={{
                backgroundColor: '#00514B',
                color: 'white',
                padding: '12px 24px',
                textDecoration: 'none',
                borderRadius: '6px',
                display: 'inline-block',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              🔍 Track Your Package
            </a>
          </div>
        </div>

        {/* Order Items */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00514B', fontSize: '18px' }}>Order Items:</h3>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px' }}>
            {orderItems.map((item, index) => (
              <div key={index} style={{ 
                padding: '8px 0', 
                borderBottom: index < orderItems.length - 1 ? '1px solid #eee' : 'none' 
              }}>
                <strong>{item.name}</strong> × {item.quantity} - ${item.price.toFixed(2)}
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#00514B', fontSize: '18px' }}>Shipping Address:</h3>
          <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '6px' }}>
            <div>{shippingAddress.name}</div>
            <div>{shippingAddress.address1}</div>
            {shippingAddress.address2 && <div>{shippingAddress.address2}</div>}
            <div>{shippingAddress.city}, {shippingAddress.postalCode}</div>
            <div>{shippingAddress.country}</div>
          </div>
        </div>

        {/* Additional Information */}
        <div style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '15px', 
          borderRadius: '6px',
          border: '1px solid #c3e6c3'
        }}>
          <h4 style={{ color: '#2d5a2d', marginTop: 0 }}>📱 Additional Tracking Options:</h4>
          <ul style={{ margin: '10px 0', paddingLeft: '20px' }}>
            <li>Track directly on <strong>DHL website</strong> using tracking number: <code>{dhlTrackingNumber}</code></li>
            <li>Check your <strong>account profile</strong> for order status updates</li>
            <li>Download the <strong>DHL mobile app</strong> for push notifications</li>
          </ul>
        </div>

        {/* Footer */}
        <div style={{ 
          marginTop: '30px', 
          paddingTop: '20px', 
          borderTop: '1px solid #dee2e6',
          textAlign: 'center',
          fontSize: '14px',
          color: '#6c757d'
        }}>
          <p>
            Questions about your order? Contact us at{' '}
            <a href="mailto:support@yourstore.com" style={{ color: '#00514B' }}>
              support@yourstore.com
            </a>
          </p>
          <p style={{ marginTop: '10px' }}>
            Thank you for choosing us! 🙏
          </p>
        </div>
      </div>
    </div>
  );
}

// Plain text version for email clients that don't support HTML
export function DHLTrackingEmailText({
  customerName,
  orderNumber,
  dhlTrackingNumber,
  estimatedDelivery,
  trackingUrl,
  orderItems,
  shippingAddress
}: DHLTrackingEmailProps) {
  return `
🚚 Your Order is On Its Way! - DHL Tracking Information

Hello ${customerName},

Great news! Your order has been shipped and is on its way to you.

📦 TRACKING INFORMATION:
Order Number: ${orderNumber}
DHL Tracking Number: ${dhlTrackingNumber}
Estimated Delivery: ${estimatedDelivery}

Track your package: ${trackingUrl}

📦 ORDER ITEMS:
${orderItems.map(item => `• ${item.name} × ${item.quantity} - $${item.price.toFixed(2)}`).join('\n')}

📍 SHIPPING ADDRESS:
${shippingAddress.name}
${shippingAddress.address1}
${shippingAddress.address2 ? shippingAddress.address2 + '\n' : ''}${shippingAddress.city}, ${shippingAddress.postalCode}
${shippingAddress.country}

📱 ADDITIONAL TRACKING OPTIONS:
• Track directly on DHL website using tracking number: ${dhlTrackingNumber}
• Check your account profile for order status updates
• Download the DHL mobile app for push notifications

Questions about your order? Contact us at support@yourstore.com

Thank you for choosing us! 🙏
  `.trim();
}
