// Test payment gateways API
const fetch = require('node-fetch');

async function testPaymentAPI() {
  try {
    console.log('Testing payment gateways API...');
    
    const response = await fetch('http://localhost:3001/api/admin/payment-gateways');
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ API is working correctly');
    } else {
      console.log('❌ API returned error:', data);
    }
  } catch (error) {
    console.error('❌ Error testing API:', error.message);
  }
}

testPaymentAPI();
