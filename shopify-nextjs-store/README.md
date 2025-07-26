# Shopify Next.js Store

A modern e-commerce storefront built with Next.js 15 and Shopify's Storefront API.

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Then add your Shopify credentials to `.env.local`:
```env
# Your Shopify store domain (without https://)
SHOPIFY_STORE_DOMAIN=your-store.myshopify.com

# Your Storefront API access token from Shopify Admin
SHOPIFY_STOREFRONT_ACCESS_TOKEN=your-access-token-here

# API Version (keep as is)
SHOPIFY_API_VERSION=2024-01
```

### 3. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your store.

## Getting Your Shopify Credentials

1. Log in to your Shopify Admin
2. Go to **Settings** → **Apps and sales channels** → **Develop apps**
3. Create a new app or use an existing one
4. Under **API credentials**, find your **Storefront API access token**
5. Copy your store domain from your browser URL (e.g., `my-store.myshopify.com`)

## Optional: Trustpilot Integration

The app includes support for displaying Trustpilot reviews. To enable:

1. Get your Trustpilot API credentials from [business.trustpilot.com](https://business.trustpilot.com)
2. Add them to your `.env.local` file
3. Reviews will automatically appear at `/reviews`

If credentials are not provided, the reviews page shows an empty state.

## Shopify Metaobjects

The app supports displaying custom metaobjects from Shopify:

1. Create metaobjects in Shopify Admin under **Settings** → **Custom data**
2. Enable Storefront API access for your metaobjects
3. The `/gallery` page displays "real_customer_closets" metaobjects
4. Customize the queries in `lib/shopify/queries/metaobjects.ts` for your metaobject types

## Features

- ✅ Product listing page
- ✅ Product detail pages
- ✅ Customer gallery (Shopify metaobjects)
- ✅ Customer reviews page (Trustpilot integration)
- ✅ Server-side rendering
- ✅ TypeScript support
- ✅ Tailwind CSS styling
- ✅ Responsive design
- ✅ Graceful error handling

## Project Structure

```
├── app/                    # Next.js App Router pages
├── lib/shopify/           # Shopify API client and queries
├── .env.local             # Your environment variables (create this)
└── .env.example           # Example environment variables
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Run production build

## Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-repo/shopify-nextjs-store&env=SHOPIFY_STORE_DOMAIN,SHOPIFY_STOREFRONT_ACCESS_TOKEN,SHOPIFY_API_VERSION)

Don't forget to add your environment variables in Vercel's dashboard!