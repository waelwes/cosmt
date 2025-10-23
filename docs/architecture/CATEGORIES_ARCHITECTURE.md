## Categories, Subcategories, Products – System Architecture

This document describes how categories, subcategories, and products are modeled, fetched, and rendered, including URL paths, SEO, breadcrumbs, admin flows, and database fields.

### 1) URL Model (Clean, Hierarchical)
- Category page: `/categories/{categorySlug}`
- Subcategory page: `/categories/{categorySlug}/{subcategorySlug}`
- Product page (clean): `/categories/{categorySlug}/{subcategorySlug}/{productSlug}`
- Product page (fallback): `/product/{id}` (only used if we don’t have reliable slugs)
- Legacy route redirect: `/categories/{categorySlug}/{subcategorySlug}/product/{productSlug}` → redirects to clean product route

Slug generation:
- `utils/slug.ts`
  - `generateSlug(text)` normalizes names to slug
  - `generateProductUrl(name, categorySlug, subcategorySlug?)` returns clean hierarchical URL (no `/product/` segment)
  - `buildProductPath(name, categorySlug?, subcategorySlug?, id?)` builds safe URLs, falling back to `/product/{id}` if slugs are missing
  - Duplicate guard: if `subcategorySlug === productSlug`, collapses path to avoid repeating the same word twice
  - `extractCategoryFromUrl(pathname)` parses category/subcategory/product from a path

### 2) Routing Structure (Next.js App Router)
- `app/categories/[category]/page.tsx` → Category page
  - Loads category by slug via service container
  - Renders `components/pages/CategoryPage` with DB-backed product list
- `app/categories/[category]/[subcategory]/page.tsx` → Subcategory page (dynamic)
  - Uses category service to resolve parent category and subcategories
  - Lists products in subcategory (or supplies context)
- `app/categories/[category]/[subcategory]/[productSlug]/page.tsx` → Product detail (clean URL)
  - Resolves category, subcategory, then finds product by slug (or generated slug from `name`)
  - Returns `components/pages/ProductDetailPage`
- `app/categories/[category]/[subcategory]/product/[productSlug]/page.tsx`
  - Redirects to the clean route above

Other storefront entry points using the model:
- `app/categories/page.tsx` → Aggregated categories view + `AllProductsSection`
- `components/sections/ProductShowcases*.tsx`, `components/ui/ProductGrid.tsx` → Use `buildProductPath` for links

### 3) Breadcrumbs
- Product detail (`components/pages/ProductDetailPage.tsx`) builds:
  - Home → Categories → Category → Subcategory → Product Name
  - Uses provided `category`/`subcategory` props or `product.categories`/`product.subcategories` if present

### 4) Data Access Layer
Dependency Injection entrypoint:
- `@/lib/di/ServiceContainer` → `getServiceFactory()` creates services used across app

Category service:
- `lib/factories/implementations/SupabaseCategoryService.ts`
  - `getCategories()` → active categories ordered by name
  - `getCategoryBySlug(slug)` → robust matching with `maybeSingle()`:
    - Exact `slug` and `is_active = true`
    - Case-insensitive `slug` and `is_active = true`
    - Fallback on `name` and `is_active = true`
    - Final relaxed fallback (diagnostics) without `is_active` constraint
  - `getSubcategories()` → all active subcategories
  - `getSubcategoriesByCategory(categoryId)` → active subcategories of category (by `category_id`)
  - `getCategoriesWithSubcategories()` → two-step fetch (categories, then subcategories per category)

Product service:
- `lib/factories/implementations/SupabaseProductService.ts`
  - `getProducts()` → active products (status = 'active'), then enriches each with `categories` and `subcategories` via separate queries
  - `getProductById(id)` → active product by ID, enrich category/subcategory
  - `getProductsByCategory(categoryId)` → filters by `category_id` and `status = 'active'`
  - `getProductsBySubcategory(subcategoryId)` → filters by `subcategory_id` and `status = 'active'`

Storefront hooks:
- `hooks/useStorefrontData.ts`
  - `useStorefrontData()` → `bestSellers`, `newProducts`, `onSaleProducts`, with loading/error
  - `useProductsByCategory(categoryId)` → products for category (includes subcategory coverage via category service)

### 5) Database Schema (Key Fields)
- Table `categories`
  - `id` (int), `name` (text), `slug` (text), `description` (text?), `image` (text?)
  - `is_active` (boolean)
- Table `subcategories`
  - `id` (int), `name` (text), `slug` (text), `description` (text?), `image` (text?)
  - `category_id` (int FK → categories.id), `is_active` (boolean)
- Table `products`
  - `id` (int), `name` (text), `slug` (optional, not required), `brand` (text),
  - `category_id` (int?), `subcategory_id` (int?)
  - `price` (numeric), `original_price` (numeric?), `stock` (int)
  - `status` ('active'|'inactive')
  - `is_on_sale` (bool), `is_best_seller` (bool)
  - `image` (text), `images` (text[]), `description` (text)
  - SEO/meta fields (optional): `meta_title`, `meta_description`, `meta_keywords`

Naming conventions:
- Database uses snake_case
- Code adapts to snake_case across services and components

### 6) Rendering and Fallbacks
- Images
  - `ProductDetailPage` sanitizes images: filters empty strings and uses `/images/product-placeholder.jpg` fallback
- Product URL resolution
  - If product DB slug is missing, the system generates a slug from `name` to match clean URLs
  - `buildProductPath` collapses duplicate slugs (subcategory == product)
- OpenGraph
  - Product pages use `openGraph.type = 'website'` (framework limitation)
  - Metadata includes canonical image and description

### 7) Admin Surfaces
- Product admin
  - List: `app/admin/products/page.tsx`
  - Edit: `app/admin/products/edit/[id]/page.tsx` (themed form, toggles use main green)
- Categories admin
  - `app/admin/products/categories/page.tsx` (view/edit/delete/add category modal)
  - Fields align with DB schema (name, slug, description, image, sort_order, is_active, meta_*)
  - Slug auto-generation from name

### 8) Error Handling and Reliability
- Timeouts/retries: `hooks/useAdminData.ts` increased timeout to 30s with retry for network/timeout
- Console diagnostics on services (timings and structured errors)
- Prevent crashers
  - Guard undefined slugs before calling `.length`
  - Use `.maybeSingle()` for non-throwing single-row queries
  - Null-safe arrays and image URL fallbacks to avoid runtime errors

### 9) Components (selected)
- `components/pages/CategoryPage.tsx` – category view and filters (analytics no-ops stubbed)
- `components/pages/SubCategoryPage.tsx` – subcategory page shell (uses DI services)
- `components/pages/ProductDetailPage.tsx` – product detail with breadcrumbs, tabs, price, stock, safe images
- `components/sections/ProductShowcases*.tsx` – curated product sections using store hooks
- `components/ui/ProductGrid.tsx` – product card grid using `buildProductPath`
- `components/sections/AllProductsSection.tsx` – simple all-products listing using product service

### 10) Data Flow Summary
1. Route params (category/subcategory/productSlug) → services fetch matching records
2. If product lacks `slug`, compare slug generated from `name`
3. Links everywhere are built via `buildProductPath` to avoid bad placeholders and ensure SEO-friendly paths
4. Breadcrumbs use resolved category/subcategory names and clean URLs
5. Images use sanitized sources and placeholder fallbacks

### 11) Known Behaviors and Decisions
- If subcategory slug equals product slug, the path collapses to avoid duplication
- Old `/product/` segment is removed from URLs; legacy route redirects
- If categories are inactive, a relaxed fallback may still resolve them (configurable)

### 12) Quick File Map
- URL helpers: `utils/slug.ts`
- Services: `lib/factories/implementations/SupabaseCategoryService.ts`, `SupabaseProductService.ts`
- Routes: `app/categories/[category]/page.tsx`, `app/categories/[category]/[subcategory]/page.tsx`, `app/categories/[category]/[subcategory]/[productSlug]/page.tsx`
- Legacy redirect: `app/categories/[category]/[subcategory]/product/[productSlug]/page.tsx`
- Key components: `components/pages/*`, `components/ui/ProductGrid.tsx`, `components/sections/*`
- Hooks: `hooks/useStorefrontData.ts`
- Admin: `app/admin/products/*`, `app/admin/products/categories/page.tsx`


