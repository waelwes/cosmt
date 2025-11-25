import { useState, useEffect, useCallback, useRef } from 'react';
import { testApiConnection, getApiDiagnostics } from '@/lib/utils/apiDiagnostics';

// Generic API response type
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
}

// Generic hook for API calls
export function useApiCall<T>(
  url: string,
  options?: RequestInit
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const retryCountRef = useRef(0);
  const isFetchingRef = useRef(false); // Prevent concurrent fetches
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async () => {
    // Ensure we're in the browser environment FIRST
    if (typeof window === 'undefined') {
      console.warn('⚠️ useApiCall: Cannot fetch in server environment');
      setError('Cannot fetch data on server. This hook must be used in client components.');
      setLoading(false);
      return;
    }
    
    // Prevent concurrent fetches
    if (isFetchingRef.current) {
      console.warn('⚠️ Fetch already in progress, skipping duplicate request');
      return;
    }
    
    // Abort any previous request
    if (abortControllerRef.current) {
      console.log('🛑 Aborting previous request');
      abortControllerRef.current.abort();
    }

    // Ensure URL is properly formatted
    // For Next.js 15, try using absolute URL if relative doesn't work
    let fetchUrl: string;
    if (url.startsWith('http://') || url.startsWith('https://')) {
      fetchUrl = url;
    } else {
      // Relative URL - ensure it starts with /
      fetchUrl = url.startsWith('/') ? url : `/${url}`;
      
      // In browser, we can also try absolute URL as fallback
      // But start with relative as it's more efficient
    }

    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading data from:', fetchUrl);
      console.log('🔄 Full URL:', typeof window !== 'undefined' ? window.location.origin + fetchUrl : fetchUrl);
      const startTime = Date.now();
      
      const controller = new AbortController();
      abortControllerRef.current = controller;
      isFetchingRef.current = true;
      
      const timeoutId = setTimeout(() => {
        console.log('⏰ API call timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout
      
      let response: Response;
      try {
        // Validate fetchUrl before attempting fetch
        if (!fetchUrl || typeof fetchUrl !== 'string') {
          throw new Error(`Invalid URL: ${fetchUrl}`);
        }
        
        // Ensure we have a valid URL format
        const isValidUrl = fetchUrl.startsWith('http') || fetchUrl.startsWith('/');
        if (!isValidUrl) {
          throw new Error(`Invalid URL format: ${fetchUrl}. URL must start with 'http' or '/'`);
        }
        
        // Use a more explicit fetch configuration for Next.js 15
        const fetchOptions: RequestInit = {
          method: options?.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options?.headers,
          },
          signal: controller.signal,
          cache: 'no-store', // Prevent caching issues in Next.js 15
          credentials: 'same-origin', // Ensure cookies are sent
        };
        
        // Merge other options but ensure signal takes precedence
        if (options) {
          Object.keys(options).forEach(key => {
            if (key !== 'signal' && key !== 'headers') {
              (fetchOptions as any)[key] = (options as any)[key];
            }
          });
        }
        fetchOptions.signal = controller.signal; // Always use our abort controller
        
        console.log('🔄 Attempting fetch:', {
          url: fetchUrl,
          method: fetchOptions.method,
          hasSignal: !!fetchOptions.signal,
          headers: fetchOptions.headers,
        });
        
        // Simple, direct fetch call
        try {
          console.log('🔄 Fetching:', fetchUrl);
          console.log('🔄 Full URL:', typeof window !== 'undefined' ? `${window.location.origin}${fetchUrl}` : fetchUrl);
          
          // Direct fetch call - let it fail naturally if there's an issue
          response = await fetch(fetchUrl, fetchOptions);
          
          console.log('✅ Fetch completed, status:', response.status);
        } catch (syncError) {
          // This catches errors that happen synchronously (before the promise resolves)
          console.error('❌ Synchronous fetch error:', {
            error: syncError,
            name: syncError instanceof Error ? syncError.name : 'Unknown',
            message: syncError instanceof Error ? syncError.message : String(syncError),
            stack: syncError instanceof Error ? syncError.stack : undefined,
            url: fetchUrl,
            fetchAvailable: typeof fetch !== 'undefined',
            windowAvailable: typeof window !== 'undefined',
          });
          throw syncError;
        }
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        // Handle network errors (CORS, connection refused, etc.)
        const errorName = fetchError instanceof Error ? fetchError.name : 'Unknown';
        const errorMessage = fetchError instanceof Error ? fetchError.message : String(fetchError);
        const errorStack = fetchError instanceof Error ? fetchError.stack : undefined;
        
        console.error('❌ Fetch error details:', {
          error: fetchError,
          name: errorName,
          message: errorMessage,
          stack: errorStack,
          url: fetchUrl,
          fullUrl: typeof window !== 'undefined' ? `${window.location.origin}${fetchUrl}` : fetchUrl,
          isAbortError: errorName === 'AbortError',
          isTypeError: errorName === 'TypeError',
          windowLocation: typeof window !== 'undefined' ? window.location.href : 'N/A',
        });
        
        if (fetchError instanceof Error) {
          if (errorName === 'AbortError') {
            throw new Error('Request timed out after 30 seconds. The server might be slow. Please try again.');
          } else if (
            errorMessage.includes('Failed to fetch') || 
            errorMessage.includes('NetworkError') || 
            errorMessage.includes('Network request failed') ||
            errorMessage.includes('fetch failed') ||
            (errorName === 'TypeError' && errorMessage.includes('fetch'))
          ) {
            const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${fetchUrl}` : fetchUrl;
            const errorMsg = `Network error: Unable to reach ${fullUrl}\n\nThis usually means:\n1. ❌ Dev server is NOT running - Run: npm run dev\n2. ❌ Wrong port - Check if server is on a different port\n3. ❌ API route doesn't exist - Verify the route file exists\n4. ❌ Network/CORS issue - Check browser Network tab\n\nError details: ${errorMessage}`;
            console.error('❌', errorMsg);
            console.error('❌ Full error object:', fetchError);
            throw new Error(errorMsg);
          }
        }
        throw fetchError;
      }
      
      clearTimeout(timeoutId);
      
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ API call completed in ${loadTime}ms`);

      if (!response.ok) {
        console.error(`❌ API Error: ${response.status} for URL: ${fetchUrl}`);
        console.error(`❌ Response headers:`, Object.fromEntries(response.headers.entries()));
        
        let errorText = '';
        try {
          errorText = await response.text();
        } catch (textError) {
          console.error('❌ Failed to read error response:', textError);
        }
        
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          if (errorText) {
            const errorData = JSON.parse(errorText);
            if (errorData.error) {
              errorMessage = errorData.error;
              console.error('❌ API Error Details:', errorData);
            }
          }
        } catch (parseError) {
          console.error('❌ Failed to parse error response:', parseError);
          console.error('❌ Raw error response:', errorText);
        }
        
        // For 404 errors, don't retry automatically - let the page handle it
        if (response.status === 404) {
          if (url.includes('/products')) {
            errorMessage = 'Page not found. Redirecting to last available page.';
          } else {
            errorMessage = 'Resource not found. Please check the URL.';
          }
        }
        
        throw new Error(errorMessage);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.success) {
        // For products API, transform the data structure
        if (url.includes('/products')) {
          const transformedData = {
            products: result.data || [],
            total: result.total || 0,
            page: result.page || 1,
            totalPages: result.totalPages || 1
          };
          setData(transformedData);
        } else {
          setData(result.data || null);
        }
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      
      // Retry logic for network errors (max 2 retries)
      if (retryCountRef.current < 2 && (
        (err instanceof Error && err.name === 'AbortError') ||
        (err instanceof Error && (err.message.includes('Failed to fetch') || err.message.includes('Network error')))
      )) {
        retryCountRef.current += 1;
        console.log(`🔄 Retrying API call (attempt ${retryCountRef.current}/2)...`);
        setTimeout(() => fetchData(), 2000); // Retry after 2 seconds
        return;
      }
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out after 30 seconds. The server might be slow. Please try again.');
      } else if (err instanceof Error && (err.message.includes('Failed to fetch') || err.message.includes('Network error') || err.message.includes('Network request failed'))) {
        // Run diagnostics when we get a network error
        const diagnostics = getApiDiagnostics();
        console.error('❌ Network Error Diagnostics:', diagnostics);
        console.error('❌ Failed URL:', fetchUrl);
        console.error('❌ Full Error:', err);
        
        // Try to test the API connection
        testApiConnection(fetchUrl).then((testResult) => {
          console.error('❌ API Connection Test Result:', testResult);
          if (!testResult.success) {
            console.error('❌ Connection test failed:', testResult.error);
            console.error('❌ Test details:', testResult.details);
          }
        }).catch((testErr) => {
          console.error('❌ Connection test threw error:', testErr);
        });
        
        // Provide actionable error message
        const fullUrl = typeof window !== 'undefined' ? `${window.location.origin}${fetchUrl}` : fetchUrl;
        const errorMsg = `Failed to fetch from ${fullUrl}\n\nPossible causes:\n1. Dev server not running - Run: npm run dev\n2. Wrong port - Check if server is on a different port\n3. API route error - Check server console for errors\n4. Network issue - Check browser network tab\n\nCheck the browser console for detailed diagnostics.`;
        setError(errorMsg);
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      }
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
      abortControllerRef.current = null;
    }
  }, [url]); // Only depend on url to prevent infinite loops - options changes handled separately

  useEffect(() => {
    // Only fetch in browser environment
    if (typeof window === 'undefined') {
      return;
    }
    
    // Simple approach: wait for page to be ready, then fetch
    const doFetch = () => {
      if (document.readyState === 'complete') {
        retryCountRef.current = 0;
        fetchData();
      } else {
        // Wait for page to load
        window.addEventListener('load', () => {
          setTimeout(() => {
            retryCountRef.current = 0;
            fetchData();
          }, 100);
        }, { once: true });
      }
    };
    
    // Small delay to ensure React has finished rendering
    const timer = setTimeout(doFetch, 100);
    
    return () => {
      clearTimeout(timer);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
      isFetchingRef.current = false;
    };
  }, [fetchData]);

  const retry = useCallback(() => {
    retryCountRef.current = 0;
    setError(null);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData, retry };
}

// Hook for products
export function useProducts(params?: {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
  page?: number;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());

  const url = `/api/admin/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  return useApiCall<{
    products: any[];
    total: number;
    page: number;
    totalPages: number;
  }>(url);
}

// Hook for orders
export function useOrders(params?: {
  search?: string;
  status?: string;
  dateRange?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.dateRange) searchParams.set('dateRange', params.dateRange);
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const url = `/api/admin/orders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  return useApiCall<any[]>(url);
}

// Hook for customers
export function useCustomers(params?: {
  search?: string;
  status?: string;
  tier?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.set('search', params.search);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.tier) searchParams.set('tier', params.tier);
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const url = `/api/admin/customers${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  return useApiCall<any[]>(url);
}

// Hook for CRUD operations
export function useCrudOperations<T>(
  baseUrl: string,
  onSuccess?: () => void,
  onError?: (error: string) => void
) {
  const [loading, setLoading] = useState(false);

  const create = async (data: Partial<T>) => {
    setLoading(true);
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<T> = await response.json();
      
      if (result.success) {
        onSuccess?.();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to create');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const update = async (id: string | number, data: Partial<T>) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result: ApiResponse<T> = await response.json();
      
      if (result.success) {
        onSuccess?.();
        return result.data;
      } else {
        throw new Error(result.error || 'Failed to update');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id: string | number) => {
    setLoading(true);
    try {
      const response = await fetch(`${baseUrl}/${id}`, {
        method: 'DELETE',
      });

      const result: ApiResponse<any> = await response.json();
      
      if (result.success) {
        onSuccess?.();
        return true;
      } else {
        throw new Error(result.error || 'Failed to delete');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      onError?.(errorMessage);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return { create, update, remove, loading };
}
