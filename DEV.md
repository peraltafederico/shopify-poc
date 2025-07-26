# Next.js Development Setup Guide

## Prerequisites

Before starting, make sure you have:
- ✅ Node.js installed (version 18 or higher)
- ✅ Your Shopify store domain (from SHOPIFY.md)
- ✅ Your Storefront API access token (from SHOPIFY.md)

## Step 1: Create Next.js Project

### 1.1 Create the Project

Open your terminal and run:

```bash
cd /Users/fperalta/Documents/projects/modular-closets-github-main/poc
npx create-next-app@latest shopify-nextjs-store
```

### 1.2 Answer the Setup Questions

When prompted, select these options:

```
✔ Would you like to use TypeScript? → Yes
✔ Would you like to use ESLint? → Yes
✔ Would you like to use Tailwind CSS? → Yes
✔ Would you like to use `src/` directory? → No
✔ Would you like to use App Router? → Yes
✔ Would you like to customize the default import alias? → No
```

### 1.3 Enter the Project

```bash
cd shopify-nextjs-store
```

## Step 2: Install Required Dependencies

### 2.1 Install Shopify GraphQL Client

```bash
npm install graphql-request graphql
```

### 2.2 Install Additional Utilities

```bash
npm install @types/node --save-dev
```

## Step 3: Set Up Environment Variables

### 3.1 Create Environment File

```bash
touch .env.local
```

### 3.2 Add Your Shopify Credentials

Open `.env.local` in your editor and add:

```env
# Your Shopify store domain (without https://)
SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com

# Your Storefront API access token
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token-here

# API Version (keep this as is)
SHOPIFY_API_VERSION=2024-01
```

**Important:** Replace `your-store-name` and `your-access-token-here` with your actual values from SHOPIFY.md!

### 3.3 Create Example Environment File

```bash
cp .env.local .env.example
```

Then edit `.env.example` to remove your actual values:

```env
# Your Shopify store domain (without https://)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Your Storefront API access token from Shopify Admin
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# API Version
SHOPIFY_API_VERSION=2024-01
```

## Step 4: Create Shopify Client

### 4.1 Create lib directory

```bash
mkdir -p lib/shopify
```

### 4.2 Create the GraphQL Client

Create `lib/shopify/client.ts`:

```typescript
import { GraphQLClient } from 'graphql-request';

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const storefrontAccessToken = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const apiVersion = process.env.SHOPIFY_API_VERSION || '2024-01';

const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;

export const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
    'Content-Type': 'application/json',
  },
});

// Helper function for making queries
export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: any;
}): Promise<T> {
  try {
    return await shopifyClient.request<T>(query, variables);
  } catch (error) {
    console.error('Shopify API Error:', error);
    throw error;
  }
}
```

### 4.3 Create Product Queries

Create `lib/shopify/queries/products.ts`:

```typescript
export const GET_ALL_PRODUCTS = `
  query GetAllProducts($first: Int = 10) {
    products(first: $first) {
      edges {
        node {
          id
          title
          description
          handle
          images(first: 1) {
            edges {
              node {
                url
                altText
              }
            }
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const GET_PRODUCT_BY_HANDLE = `
  query GetProductByHandle($handle: String!) {
    product(handle: $handle) {
      id
      title
      description
      handle
      images(first: 5) {
        edges {
          node {
            url
            altText
          }
        }
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 100) {
        edges {
          node {
            id
            title
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
```

### 4.4 Create TypeScript Types

Create `lib/shopify/types.ts`:

```typescript
export interface Product {
  id: string;
  title: string;
  description: string;
  handle: string;
  images: {
    edges: Array<{
      node: {
        url: string;
        altText: string | null;
      };
    }>;
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

export interface ProductVariant {
  id: string;
  title: string;
  availableForSale: boolean;
  price: {
    amount: string;
    currencyCode: string;
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: {
    edges: Array<{
      node: {
        id: string;
        quantity: number;
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      };
    }>;
  };
}
```

## Step 5: Create Your First Pages

### 5.1 Update Home Page

Replace `app/page.tsx`:

```typescript
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_ALL_PRODUCTS } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Link from 'next/link';
import Image from 'next/image';

interface ProductsResponse {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export default async function Home() {
  const { products } = await shopifyFetch<ProductsResponse>({
    query: GET_ALL_PRODUCTS,
    variables: { first: 12 },
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.edges.map(({ node: product }) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {product.images.edges[0] && (
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{product.title}</h2>
                <p className="text-gray-600">
                  ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  {' '}{product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
```

### 5.2 Configure Next.js for Images

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

### 5.3 Create Product Detail Page

Create `app/products/[handle]/page.tsx`:

```typescript
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductResponse {
  product: Product & {
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  const { product } = await shopifyFetch<ProductResponse>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: params.handle },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {product.images.edges.map(({ node: image }, index) => (
            <div key={index} className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl text-gray-700">
              ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              {' '}{product.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants.edges.length > 1 && (
            <div>
              <h3 className="font-semibold mb-2">Options:</h3>
              <div className="space-y-2">
                {product.variants.edges.map(({ node: variant }) => (
                  <div key={variant.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{variant.title}</span>
                    <span className="text-sm text-gray-600">
                      {variant.availableForSale ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
            Add to Cart (Coming Soon)
          </button>
        </div>
      </div>
    </main>
  );
}
```

## Step 6: Run Your Development Server

### 6.1 Start the Server

```bash
npm run dev
```

### 6.2 View Your Store

Open your browser and go to:
```
http://localhost:3000
```

You should see:
- Your products from Shopify
- Clickable product cards
- Product detail pages

## Step 7: Common Development Commands

### Build for Production
```bash
npm run build
```

### Run Production Build Locally
```bash
npm run start
```

### Check for TypeScript Errors
```bash
npm run type-check
```

### Format Code
```bash
npm run format
```

## Troubleshooting

### Issue: "SHOPIFY_STORE_DOMAIN is not defined"
**Solution:** Make sure your `.env.local` file exists and contains your credentials

### Issue: Products not showing
**Solution:** Check that:
1. Your access token is correct
2. Your products are active in Shopify
3. Your store domain is correct (no https://)

### Issue: Images not loading
**Solution:** Make sure you updated `next.config.js` with the image configuration

## Next Steps

Now that your basic setup is working, you can:

1. **Add Cart Functionality**
   - Create cart context
   - Add "Add to Cart" functionality
   - Build cart drawer

2. **Implement Search**
   - Add search bar
   - Create search results page

3. **Add Collections**
   - Create collection pages
   - Add navigation menu

4. **Deploy to Production**
   - Deploy to Vercel
   - Set up environment variables
   - Configure custom domain

## Project Structure

Your project should now look like this:

```
shopify-nextjs-store/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx              # Root layout
│   └── products/
│       └── [handle]/
│           └── page.tsx        # Product detail
├── lib/
│   └── shopify/
│       ├── client.ts           # GraphQL client
│       ├── types.ts           # TypeScript types
│       └── queries/
│           └── products.ts    # Product queries
├── public/
├── .env.local                  # Your credentials (git ignored)
├── .env.example               # Example for others
├── next.config.js             # Next.js config
├── package.json
└── tsconfig.json
```

Congratulations! You now have a working Next.js store connected to Shopify! 🎉