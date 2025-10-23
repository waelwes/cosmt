import { useState, useEffect, useCallback } from 'react';

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
  const [retryCount, setRetryCount] = useState(0);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading data from:', url);
      const startTime = Date.now();
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ API call timeout after 30 seconds');
        controller.abort();
      }, 30000); // 30 second timeout
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        signal: controller.signal,
        ...options,
      });
      
      clearTimeout(timeoutId);
      
      const loadTime = Date.now() - startTime;
      console.log(`⏱️ API call completed in ${loadTime}ms`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
      if (retryCount < 2 && (
        (err instanceof Error && err.name === 'AbortError') ||
        (err instanceof Error && err.message.includes('Failed to fetch'))
      )) {
        console.log(`🔄 Retrying API call (attempt ${retryCount + 1}/2)...`);
        setRetryCount(prev => prev + 1);
        setTimeout(() => fetchData(), 2000); // Retry after 2 seconds
        return;
      }
      
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Request timed out after 30 seconds. The server might be slow. Please try again.');
      } else if (err instanceof Error && err.message.includes('Failed to fetch')) {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
      }
    } finally {
      setLoading(false);
    }
  }, [url, options, retryCount]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const retry = useCallback(() => {
    setRetryCount(0);
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
