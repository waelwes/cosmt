import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

export interface OrderItem {
  id: number;
  product_id: number;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

export interface UserOrder {
  id: string;
  order_number: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_amount: number;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_status: 'pending' | 'preparing' | 'shipped' | 'delivered' | 'returned';
  shipping_address: string;
  billing_address: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

// Hook for fetching user orders
export function useUserOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch orders for the current user
        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              product_name,
              product_image,
              quantity,
              price,
              total
            )
          `)
          .or(`customer_id.eq.${user.id},customer.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the data to match our interface
        const transformedOrders = data?.map(order => ({
          id: order.id,
          order_number: order.id,
          customer_id: order.customer_id,
          customer_name: order.customer,
          customer_email: order.email,
          customer_phone: order.phone,
          total_amount: order.total,
          status: order.status,
          payment_status: order.payment_status,
          shipping_status: order.shipping_status,
          shipping_address: order.shipping_address,
          billing_address: order.shipping_address, // Using same address for now
          items: order.order_items || [],
          created_at: order.created_at,
          updated_at: order.updated_at
        })) || [];

        setOrders(transformedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return { orders, loading, error, refetch: () => fetchOrders() };
}

// Hook for creating a new order
export function useCreateOrder() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createOrder = async (orderData: {
    items: Array<{
      product_id: number;
      product_name: string;
      product_image: string;
      quantity: number;
      price: number;
    }>;
    shipping_address: string;
    billing_address?: string;
  }) => {
    if (!user) {
      throw new Error('User must be logged in to create an order');
    }

    setLoading(true);
    setError(null);

    try {
      // Calculate total
      const total = orderData.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user.id,
          customer: user.id, // Set customer to user ID for consistency
          email: user.email,
          phone: '', // You might want to get this from user profile
          total: total,
          status: 'pending',
          payment_status: 'pending',
          shipping_status: 'pending',
          shipping_address: orderData.shipping_address,
          date: new Date().toISOString().split('T')[0],
          items: orderData.items.length
        })
        .select()
        .single();

      if (orderError) {
        throw orderError;
      }

      // Create order items
      const orderItems = orderData.items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        product_name: item.product_name,
        product_image: item.product_image,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) {
        throw itemsError;
      }

      return order;
    } catch (err) {
      console.error('Error creating order:', err);
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOrder, loading, error };
}

// Hook for fetching a single order
export function useOrder(orderId: string) {
  const { user } = useAuth();
  const [order, setOrder] = useState<UserOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!user || !orderId) {
        setOrder(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from('orders')
          .select(`
            *,
            order_items (
              id,
              product_id,
              product_name,
              product_image,
              quantity,
              price,
              total
            )
          `)
          .eq('id', orderId)
          .or(`customer_id.eq.${user.id},customer.eq.${user.id}`)
          .single();

        if (error) {
          throw error;
        }

        if (data) {
          const transformedOrder = {
            id: data.id,
            order_number: data.id,
            customer_id: data.customer_id,
            customer_name: data.customer,
            customer_email: data.email,
            customer_phone: data.phone,
            total_amount: data.total,
            status: data.status,
            payment_status: data.payment_status,
            shipping_status: data.shipping_status,
            shipping_address: data.shipping_address,
            billing_address: data.shipping_address,
            items: data.order_items || [],
            created_at: data.created_at,
            updated_at: data.updated_at
          };
          setOrder(transformedOrder);
        } else {
          setOrder(null);
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch order');
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, orderId]);

  return { order, loading, error };
}
