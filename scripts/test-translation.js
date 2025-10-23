// Test script to verify translation services are working
const { freeTranslationService } = require('../lib/freeTranslationService');

async function testTranslation() {
  console.log('🧪 Testing Free Translation Services...\n');

  // Test data
  const testTexts = [
    'Hydrating Face Serum',
    'Anti-Aging Night Cream', 
    'Vitamin C Brightening Mask'
  ];

  const languages = ['ar', 'tr', 'de', 'fr', 'es'];

  try {
    // Test each language
    for (const lang of languages) {
      console.log(`\n🌍 Testing ${lang.toUpperCase()} translations:`);
      console.log('─'.repeat(50));
      
      for (const text of testTexts) {
        try {
          const result = await freeTranslationService.translateText(text, lang);
          console.log(`✅ "${text}" → "${result.text}" (via ${result.source})`);
        } catch (error) {
          console.log(`❌ "${text}" → Failed: ${error.message}`);
        }
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      }
    }

    // Test service availability
    console.log('\n🔍 Checking service availability:');
    console.log('─'.repeat(50));
    
    const services = freeTranslationService.getAvailableServices();
    console.log(`Available services: ${services.join(', ')}`);
    
    for (const service of services) {
      const isWorking = await freeTranslationService.testService(service);
      console.log(`${isWorking ? '✅' : '❌'} ${service}: ${isWorking ? 'Working' : 'Not available'}`);
    }

    console.log('\n🎉 Translation test completed!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Run the test
testTranslation();
