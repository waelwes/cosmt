import { redirect } from 'next/navigation';

// This page handles old /product/[id] URLs and redirects to the new hierarchical system
export default function OldProductRedirect({ params }: { params: { id: string } }) {
  // For now, redirect to categories page
  // In a real implementation, you might want to:
  // 1. Look up the product by ID
  // 2. Get its category and subcategory
  // 3. Redirect to the proper hierarchical URL
  redirect('/categories');
}
