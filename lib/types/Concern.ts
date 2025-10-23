export interface Concern {
  id: number;
  name: string;
  slug: string;
  description?: string;
  type: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductConcern {
  id: number;
  product_id: number;
  concern_id: number;
  created_at: string;
}

export interface ConcernWithProducts {
  concern: Concern;
  products: any[]; // You can use your Product type here
}
