# Fix RLS Policy Error - "new row violates row-level security policy"

## Problem
You're getting the error: `Failed to save product: new row violates row-level security policy for table "products"`

This happens because Supabase has Row Level Security (RLS) enabled on the products table, but the policies aren't configured to allow inserts.

## Solution Options

### Option 1: Fix RLS Policies (Recommended)
Run the SQL commands in `fix-rls-policies.sql` in your Supabase SQL Editor:

1. Go to your Supabase dashboard
2. Navigate to SQL Editor
3. Copy and paste the contents of `fix-rls-policies.sql`
4. Run the script

This will create proper RLS policies that allow all operations on the products table.

### Option 2: Use Service Role Key (Already Implemented)
The code has been updated to use the service role key when available. To use this:

1. Get your service role key from Supabase:
   - Go to Settings > API
   - Copy the "service_role" key (not the anon key)

2. Add it to your environment variables:
   ```env
   # Add this to your .env.local file
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   ```

3. Restart your development server

### Option 3: Disable RLS (Not Recommended for Production)
If you want to disable RLS entirely (not recommended for production):

```sql
-- Run this in Supabase SQL Editor
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE customers DISABLE ROW LEVEL SECURITY;
```

## What Was Fixed

1. **Updated Admin API** - Now uses service role key when available
2. **Created Admin Client** - New `lib/supabase-admin.ts` with service role key
3. **SQL Fix Script** - `fix-rls-policies.sql` with proper RLS policies
4. **Fallback Support** - Falls back to anon key if service role key isn't available

## Testing

After applying either solution:

1. Go to `http://localhost:3000/admin/products/add`
2. Fill out the product form
3. Click "Save Product"
4. The product should be created successfully

## Security Notes

- The service role key bypasses RLS entirely - use only for admin operations
- The RLS policies allow all operations - you can restrict them later based on your needs
- For production, consider implementing proper user authentication and role-based policies

## Environment Variables Needed

```env
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Optional (for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```
