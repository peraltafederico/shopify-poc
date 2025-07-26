# Next.js + Shopify Storefront API Integration Plan

## Project Overview

This proof of concept demonstrates how to build a modern e-commerce frontend using Next.js App Router with Shopify's Storefront API, explaining why direct Liquid integration isn't possible and providing a complete headless commerce solution.

## Architecture

```
┌─────────────────────┐         ┌─────────────────────┐
│   Next.js App       │         │   Shopify Backend   │
│   (App Router)      │ <-----> │   (Headless CMS)    │
│                     │ GraphQL │                     │
│ - React Server      │   API   │ - Products          │
│ - Components        │         │ - Inventory         │
│ - API Routes        │         │ - Customers         │
│ - Static Assets     │         │ - Orders            │
└─────────────────────┘         └─────────────────────┘
        ↓                                 ↓
   Vercel/AWS                    Shopify Infrastructure
   (Your Host)                   (Shopify's Servers)
```

## Why This Architecture?

### 1. **Separation of Concerns**
- Shopify handles commerce logic (inventory, payments, taxes)
- Next.js handles presentation and user experience
- Clear boundaries between systems

### 2. **Performance Benefits**
- Static site generation for product pages
- Incremental static regeneration for updates
- Edge caching for global performance

### 3. **Developer Experience**
- Modern React development
- TypeScript support
- Hot module replacement
- Component-based architecture

## Core Components

### 1. **Data Fetching Layer**
```
/lib/shopify/
├── client.ts          # GraphQL client setup
├── queries/           # GraphQL queries
│   ├── products.ts
│   ├── collections.ts
│   └── customer.ts
└── types.ts          # TypeScript definitions
```

### 2. **App Routes Structure**
```
/app/
├── page.tsx                    # Homepage
├── products/
│   ├── page.tsx               # Products listing
│   └── [handle]/
│       └── page.tsx           # Product detail
├── collections/
│   └── [handle]/
│       └── page.tsx           # Collection page
├── cart/
│   └── page.tsx               # Cart page
└── api/
    └── cart/
        ├── add/route.ts       # Add to cart
        └── update/route.ts    # Update cart
```

### 3. **Component Library**
```
/components/
├── ProductCard.tsx
├── CartDrawer.tsx
├── Navigation.tsx
└── SearchBar.tsx
```

## Data Flow

### 1. **Server-Side Rendering (SSR)**
```
Request → Next.js Server → Fetch from Storefront API → Render HTML → Response
```

### 2. **Static Generation (SSG)**
```
Build Time → Fetch all products → Generate static pages → Deploy
```

### 3. **Client-Side Updates**
```
User Action → API Route → Storefront API → Update State → Re-render
```

## Key Features to Implement

### Phase 1: Foundation
- [x] Project setup with Next.js 14 App Router
- [x] Shopify Storefront API connection
- [x] Environment configuration
- [x] TypeScript setup

### Phase 2: Core Commerce
- [ ] Product listing page
- [ ] Product detail page
- [ ] Collection pages
- [ ] Search functionality

### Phase 3: Cart & Checkout
- [ ] Add to cart functionality
- [ ] Cart management (update/remove)
- [ ] Cart drawer component
- [ ] Redirect to Shopify checkout

### Phase 4: Customer Features
- [ ] Customer authentication
- [ ] Account pages
- [ ] Order history
- [ ] Wishlist (metafields)

### Phase 5: Enhancements
- [ ] Product filtering
- [ ] Sort functionality
- [ ] Product recommendations
- [ ] SEO optimization

## Technical Decisions

### 1. **Why App Router?**
- Server components for better performance
- Simplified data fetching
- Built-in layouts and loading states
- Parallel route segments

### 2. **Why Storefront API?**
- Designed for custom storefronts
- GraphQL for efficient queries
- Real-time inventory
- Secure customer authentication

### 3. **Why Not Liquid?**
- Liquid runs on Shopify's servers only
- No direct access from external servers
- Different execution contexts
- See LIQUID.md for detailed explanation

## Security Considerations

1. **API Keys**
   - Public Storefront API token (safe for client)
   - Never expose Admin API keys

2. **Customer Data**
   - Handle authentication tokens securely
   - Use httpOnly cookies for sessions
   - Implement proper CORS policies

3. **Checkout**
   - Always use Shopify's hosted checkout
   - Don't store payment information

## Performance Targets

- **LCP**: < 2.5s (Largest Contentful Paint)
- **FID**: < 100ms (First Input Delay)
- **CLS**: < 0.1 (Cumulative Layout Shift)
- **Time to Interactive**: < 3.5s

## Development Workflow

1. **Local Development**
   ```bash
   npm run dev
   ```

2. **Testing**
   ```bash
   npm run test
   npm run test:e2e
   ```

3. **Deployment**
   ```bash
   npm run build
   vercel --prod
   ```

## Success Metrics

- ✅ All products fetched from Storefront API
- ✅ Cart persists across sessions
- ✅ Checkout redirects to Shopify
- ✅ Customer can log in and view orders
- ✅ Performance scores > 90 on Lighthouse

## Next Steps

1. Follow SHOPIFY.md to set up Shopify store
2. Follow DEV.md to create Next.js project
3. Implement features phase by phase
4. Deploy to production