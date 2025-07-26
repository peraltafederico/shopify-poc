# Trustpilot Reviews Integration Guide

## Overview

This guide explains how to fetch and display Trustpilot reviews in your Next.js + Shopify application.

## Integration Options

### Option 1: Trustpilot Business API (Recommended)

The most flexible approach for fetching reviews programmatically.

#### Prerequisites
- Trustpilot Business account
- API credentials (API Key and API Secret)
- Your Trustpilot Business Unit ID

#### Implementation

**1. Install dependencies:**
```bash
npm install axios
```

**2. Create Trustpilot API client:**

```typescript
// lib/trustpilot/client.ts
import axios from 'axios';

class TrustpilotClient {
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private apiKey: string,
    private apiSecret: string,
    private businessUnitId: string
  ) {}

  // Get access token
  private async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    const response = await axios.post(
      'https://api.trustpilot.com/v1/oauth/oauth-business-users-for-applications/accesstoken',
      `grant_type=client_credentials`,
      {
        auth: {
          username: this.apiKey,
          password: this.apiSecret,
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    this.accessToken = response.data.access_token;
    this.tokenExpiry = new Date(Date.now() + response.data.expires_in * 1000);
    
    return this.accessToken;
  }

  // Get business unit reviews
  async getReviews(options?: {
    page?: number;
    perPage?: number;
    stars?: number[];
  }) {
    const token = await this.getAccessToken();
    
    const params = new URLSearchParams({
      page: (options?.page || 1).toString(),
      perPage: (options?.perPage || 20).toString(),
      ...(options?.stars && { stars: options.stars.join(',') }),
    });

    const response = await axios.get(
      `https://api.trustpilot.com/v1/business-units/${this.businessUnitId}/reviews?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  // Get product reviews (if using product reviews)
  async getProductReviews(sku: string, options?: {
    page?: number;
    perPage?: number;
  }) {
    const token = await this.getAccessToken();
    
    const params = new URLSearchParams({
      page: (options?.page || 1).toString(),
      perPage: (options?.perPage || 20).toString(),
    });

    const response = await axios.get(
      `https://api.trustpilot.com/v1/product-reviews/business-units/${this.businessUnitId}/products/${sku}/reviews?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  // Get summary statistics
  async getBusinessSummary() {
    const token = await this.getAccessToken();
    
    const response = await axios.get(
      `https://api.trustpilot.com/v1/business-units/${this.businessUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
}

export const trustpilot = new TrustpilotClient(
  process.env.TRUSTPILOT_API_KEY!,
  process.env.TRUSTPILOT_API_SECRET!,
  process.env.TRUSTPILOT_BUSINESS_UNIT_ID!
);
```

**3. Add environment variables:**

```env
# .env.local
TRUSTPILOT_API_KEY=your-api-key
TRUSTPILOT_API_SECRET=your-api-secret
TRUSTPILOT_BUSINESS_UNIT_ID=your-business-unit-id
```

**4. Create API route for reviews:**

```typescript
// app/api/reviews/route.ts
import { NextResponse } from 'next/server';
import { trustpilot } from '@/lib/trustpilot/client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const perPage = searchParams.get('perPage') || '10';

    const reviews = await trustpilot.getReviews({
      page: parseInt(page),
      perPage: parseInt(perPage),
    });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}
```

**5. Display reviews in your component:**

```typescript
// components/TrustpilotReviews.tsx
'use client';

import { useEffect, useState } from 'react';

interface Review {
  id: string;
  consumer: {
    displayName: string;
  };
  stars: number;
  title: string;
  text: string;
  createdAt: string;
}

export default function TrustpilotReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/reviews')
      .then(res => res.json())
      .then(data => {
        setReviews(data.reviews);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading reviews...</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Customer Reviews</h2>
      {reviews.map((review) => (
        <div key={review.id} className="border p-4 rounded">
          <div className="flex items-center mb-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={i < review.stars ? 'text-yellow-500' : 'text-gray-300'}>
                  ★
                </span>
              ))}
            </div>
            <span className="ml-2 font-semibold">{review.consumer.displayName}</span>
          </div>
          <h3 className="font-semibold">{review.title}</h3>
          <p className="text-gray-600">{review.text}</p>
          <p className="text-sm text-gray-500 mt-2">
            {new Date(review.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}
```

### Option 2: TrustBox Widget (Simpler)

If you don't need custom styling, you can use Trustpilot's pre-built widgets.

**1. Add TrustBox script to your layout:**

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* TrustBox script */}
        <script
          type="text/javascript"
          src="//widget.trustpilot.com/bootstrap/v5/tp.widget.bootstrap.min.js"
          async
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

**2. Create TrustBox component:**

```typescript
// components/TrustBox.tsx
'use client';

import { useEffect, useRef } from 'react';

interface TrustBoxProps {
  templateId: string;
  businessunitId: string;
  height?: string;
  width?: string;
}

export default function TrustBox({
  templateId,
  businessunitId,
  height = '350px',
  width = '100%',
}: TrustBoxProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.Trustpilot) {
      window.Trustpilot.loadFromElement(ref.current, true);
    }
  }, []);

  return (
    <div
      ref={ref}
      className="trustpilot-widget"
      data-locale="en-US"
      data-template-id={templateId}
      data-businessunit-id={businessunitId}
      data-style-height={height}
      data-style-width={width}
      data-theme="light"
    >
      <a
        href={`https://www.trustpilot.com/review/${businessunitId}`}
        target="_blank"
        rel="noopener"
      >
        Trustpilot
      </a>
    </div>
  );
}
```

**3. Use the TrustBox:**

```typescript
// app/page.tsx
import TrustBox from '@/components/TrustBox';

export default function Home() {
  return (
    <main>
      {/* Your existing content */}
      
      {/* Trustpilot Reviews Widget */}
      <TrustBox
        templateId="5419b6a8b0d04a076446a9ad" // Mini Carousel template
        businessunitId="your-business-unit-id"
      />
    </main>
  );
}
```

### Option 3: Public Reviews API (Limited)

For basic needs without authentication:

```typescript
// lib/trustpilot/public-api.ts
export async function getPublicReviews(businessUnitId: string) {
  const response = await fetch(
    `https://api.trustpilot.com/v1/business-units/${businessUnitId}/reviews?apikey=${process.env.NEXT_PUBLIC_TRUSTPILOT_API_KEY}`
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch reviews');
  }
  
  return response.json();
}
```

## Shopify Integration Considerations

### 1. Product Reviews
If you want to show reviews for specific products:
- Map Shopify product SKUs to Trustpilot
- Use the Product Reviews API endpoint
- Display reviews on product detail pages

### 2. Order Integration
To automatically invite customers to leave reviews:
- Set up Trustpilot's Automatic Invitation Service
- Use Shopify webhooks to trigger invitations after order fulfillment
- Or use Trustpilot's Shopify app for automatic integration

### 3. SEO Benefits
To get SEO value from reviews:
- Use server-side rendering (already doing with Next.js)
- Implement structured data (JSON-LD) for reviews
- Use Trustpilot's SEO-friendly widgets

## Example: Reviews on Product Page

```typescript
// app/products/[handle]/page.tsx
import { shopifyFetch } from '@/lib/shopify/client';
import { trustpilot } from '@/lib/trustpilot/client';

export default async function ProductPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  // Fetch product from Shopify
  const { product } = await shopifyFetch({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: params.handle },
  });

  // Fetch product reviews from Trustpilot
  let reviews = null;
  try {
    if (product.variants.edges[0]?.node.sku) {
      reviews = await trustpilot.getProductReviews(
        product.variants.edges[0].node.sku
      );
    }
  } catch (error) {
    console.error('Failed to fetch reviews:', error);
  }

  return (
    <div>
      {/* Product details */}
      
      {/* Reviews section */}
      {reviews && (
        <section className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <div className="space-y-4">
            {reviews.reviews.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                {/* Review content */}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
```

## Best Practices

1. **Cache reviews** to reduce API calls
2. **Handle errors gracefully** - don't break the page if reviews fail
3. **Show loading states** while fetching reviews
4. **Implement pagination** for many reviews
5. **Use Trustpilot's brand guidelines** when displaying reviews
6. **Include review structured data** for SEO

## Conclusion

Integrating Trustpilot reviews into your Next.js + Shopify store is straightforward. Choose:
- **Business API** for full control and custom design
- **TrustBox widgets** for quick implementation
- **Public API** for basic, read-only access

The Business API is recommended for the best flexibility and features.