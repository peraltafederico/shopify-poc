# Next.js + Shopify Storefront API Integration Plan

## Project Overview

This proof of concept demonstrates a basic e-commerce frontend using Next.js App Router with Shopify's Storefront API, showing how to fetch and display products from a Shopify store.

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Next.js App       │         │   Shopify Backend   │
│   (App Router)      │ <-----> │   (Headless CMS)    │
│                     │ GraphQL │                     │
│ - Product Listing   │   API   │ - Products          │
│ - Product Details   │         │ - Inventory         │
│ - Server Components │         │ - Storefront API    │
└─────────────────────┘         └─────────────────────┘
```

## What Was Implemented

### ✅ Completed Features

1. **Project Setup**
   - Next.js 15 with App Router
   - TypeScript configuration
   - Tailwind CSS for styling
   - Environment variables setup

2. **Shopify Integration**
   - GraphQL client using `graphql-request`
   - Storefront API connection
   - Product queries (list and detail)
   - TypeScript types for Shopify data

3. **Pages Created**
   - Homepage with product grid
   - Product detail pages with dynamic routing
   - Responsive layout

4. **Core Functionality**
   - Fetch all products from Shopify
   - Display product images, titles, and prices
   - Product detail view with variants
   - Server-side rendering for SEO

## Project Structure

```
/shopify-nextjs-store/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Homepage (product listing)
│   ├── globals.css             # Global styles
│   └── products/
│       └── [handle]/
│           └── page.tsx        # Product detail page
├── lib/
│   └── shopify/
│       ├── client.ts           # GraphQL client setup
│       ├── types.ts            # TypeScript definitions
│       └── queries/
│           └── products.ts     # GraphQL queries
├── .env.local                  # Environment variables
├── .env.example                # Example env file
├── next.config.js              # Next.js configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── package.json                # Dependencies
```

## Technical Implementation

### GraphQL Client
```typescript
// Simple client using graphql-request
const endpoint = `https://${domain}/api/${apiVersion}/graphql.json`;
const shopifyClient = new GraphQLClient(endpoint, {
  headers: {
    'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
  },
});
```

### Data Fetching
- Server-side data fetching in React Server Components
- No client-side state management needed
- Direct async/await in components

### Environment Variables
```env
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-token
SHOPIFY_API_VERSION=2024-01
```

## Next Steps (Not Implemented)

These features could be added to expand the proof of concept:

1. **Cart Functionality**
   - Add to cart button
   - Cart management
   - Checkout redirect

2. **Enhanced Features**
   - Search functionality
   - Product filtering
   - Collections/categories
   - Customer authentication

3. **Performance**
   - Static generation for products
   - Image optimization
   - Caching strategies

4. **Production Ready**
   - Error handling
   - Loading states
   - SEO metadata
   - Analytics

## Key Learnings

1. **Shopify Storefront API** provides a clean GraphQL interface for headless commerce
2. **Next.js App Router** with Server Components simplifies data fetching
3. **TypeScript** helps with Shopify's complex data structures
4. **Minimal setup** required - just API credentials and GraphQL queries

This POC proves that a basic Shopify + Next.js integration can be achieved with minimal code and configuration.