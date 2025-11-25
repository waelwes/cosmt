/**
 * API Diagnostics Utility
 * Helps diagnose "Failed to fetch" errors
 */

export async function testApiConnection(url: string): Promise<{
  success: boolean;
  error?: string;
  details?: any;
}> {
  try {
    // Check if we're in browser
    if (typeof window === 'undefined') {
      return {
        success: false,
        error: 'Cannot test API connection on server side',
      };
    }

    const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;
    
    console.log('🔍 Testing API connection to:', fullUrl);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout for test
    
    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId);
      
      return {
        success: response.ok,
        details: {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
        },
      };
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error) {
        return {
          success: false,
          error: fetchError.message,
          details: {
            name: fetchError.name,
            message: fetchError.message,
            stack: fetchError.stack,
          },
        };
      }
      
      return {
        success: false,
        error: 'Unknown fetch error',
        details: { error: fetchError },
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: { error },
    };
  }
}

export function getApiDiagnostics(): {
  isBrowser: boolean;
  origin: string | null;
  userAgent: string | null;
  apiRoutes: string[];
} {
  const isBrowser = typeof window !== 'undefined';
  
  return {
    isBrowser,
    origin: isBrowser ? window.location.origin : null,
    userAgent: isBrowser ? navigator.userAgent : null,
    apiRoutes: [
      '/api/admin/products',
      '/api/admin/categories',
      '/api/admin/orders',
      '/api/admin/customers',
    ],
  };
}

