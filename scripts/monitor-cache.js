// Simple script to monitor cache performance
const { globalCache } = require('../lib/cache/globalCache');

console.log('🔍 Cache Monitor Started');
console.log('📊 Initial cache stats:', globalCache.getStats());

// Monitor cache every 10 seconds
setInterval(() => {
  const stats = globalCache.getStats();
  console.log(`📊 Cache Stats: ${stats.size} items cached`);
  if (stats.keys.length > 0) {
    console.log(`   Keys: ${stats.keys.join(', ')}`);
  }
}, 10000);

// Keep the script running
process.on('SIGINT', () => {
  console.log('\n🛑 Cache Monitor Stopped');
  process.exit(0);
});
