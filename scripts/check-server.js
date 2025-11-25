/**
 * Simple script to check if the Next.js dev server is running
 * Run this with: node scripts/check-server.js
 */

const http = require('http');

const PORT = process.env.PORT || 3000;
const HOST = 'localhost';

console.log(`🔍 Checking if server is running on http://${HOST}:${PORT}...\n`);

// Test health endpoint
const testEndpoint = (path, name) => {
  return new Promise((resolve) => {
    const req = http.get(`http://${HOST}:${PORT}${path}`, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log(`✅ ${name}: Working (Status: ${res.statusCode})`);
          try {
            const json = JSON.parse(data);
            console.log(`   Response:`, JSON.stringify(json, null, 2));
          } catch (e) {
            console.log(`   Response: ${data.substring(0, 100)}...`);
          }
          resolve(true);
        } else {
          console.log(`⚠️  ${name}: Status ${res.statusCode}`);
          resolve(false);
        }
      });
    });
    
    req.on('error', (err) => {
      console.log(`❌ ${name}: Failed`);
      console.log(`   Error: ${err.message}`);
      if (err.code === 'ECONNREFUSED') {
        console.log(`   💡 The server is NOT running. Start it with: npm run dev`);
      }
      resolve(false);
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      console.log(`⏰ ${name}: Timeout (server might be slow)`);
      resolve(false);
    });
  });
};

async function checkServer() {
  const healthOk = await testEndpoint('/api/health', 'Health Endpoint');
  console.log('');
  const productsOk = await testEndpoint('/api/admin/products', 'Products API');
  
  console.log('\n📊 Summary:');
  if (healthOk && productsOk) {
    console.log('✅ Server is running and API routes are working!');
    process.exit(0);
  } else if (healthOk) {
    console.log('⚠️  Server is running but Products API has issues');
    process.exit(1);
  } else {
    console.log('❌ Server is NOT running or not accessible');
    console.log('💡 Start the server with: npm run dev');
    process.exit(1);
  }
}

checkServer();

