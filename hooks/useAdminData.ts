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

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options?.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: ApiResponse<T> = await response.json();
      
      if (result.success) {
        setData(result.data || null);
      } else {
        setError(result.error || 'Unknown error occurred');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [url, options]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}

// Hook for products
export function useProducts(params?: {
  search?: string;
  category?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: string;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.search) searchParams.set('search', params.search);
  if (params?.category) searchParams.set('category', params.category);
  if (params?.status) searchParams.set('status', params.status);
  if (params?.sortBy) searchParams.set('sortBy', params.sortBy);
  if (params?.sortOrder) searchParams.set('sortOrder', params.sortOrder);

  const url = `/api/admin/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  return useApiCall<any[]>(url);
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
