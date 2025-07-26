# Trustpilot Integration Step-by-Step Guide

## Step 1: Install Trustpilot App in Shopify

### 1.1 Go to Shopify App Store
1. In your Shopify Admin, click **Apps** in the left sidebar
2. Click **Visit Shopify App Store**
3. Search for **"Trustpilot Reviews"**
4. Click on the official **Trustpilot Reviews** app

### 1.2 Install the App
1. Click **Add app**
2. Click **Install app**
3. You'll be redirected to Trustpilot
4. **Sign up** for a Trustpilot account or **log in** if you have one
5. Follow the setup wizard

### 1.3 Connect Your Store
1. Authorize Trustpilot to access your Shopify store
2. Select your business category
3. Confirm your business information
4. Complete the initial setup

## Step 2: Get Your Trustpilot Credentials

### 2.1 Find Your Business Unit ID
1. Log in to [business.trustpilot.com](https://business.trustpilot.com)
2. Go to **Settings** → **Business information**
3. Copy your **Business Unit ID** (looks like: `5f7e8d9c2a1b3c4d5e6f7a8b`)

### 2.2 Create API Application (for fetching reviews)
1. Go to **Integrations** → **API**
2. Click **Create application**
3. Fill in:
   - Application name: `Next.js Store`
   - Description: `Fetching reviews for Next.js frontend`
4. Click **Create**
5. Save your:
   - **API Key**
   - **API Secret**

## Step 3: Add Trustpilot to Your Next.js Project

### 3.1 Install Dependencies
```bash
cd shopify-nextjs-store
npm install axios
```

### 3.2 Add Environment Variables
Add to your `.env.local`:
```env
# Trustpilot Configuration
TRUSTPILOT_API_KEY=your-api-key-here
TRUSTPILOT_API_SECRET=your-api-secret-here
TRUSTPILOT_BUSINESS_UNIT_ID=your-business-unit-id-here
```

### 3.3 Create Trustpilot Types
Create `lib/trustpilot/types.ts`:
```typescript
export interface TrustpilotReview {
  id: string;
  consumer: {
    id: string;
    displayName: string;
    displayLocation?: string;
  };
  businessUnit: {
    id: string;
    displayName: string;
  };
  stars: number;
  title: string;
  text: string;
  language: string;
  createdAt: string;
  experiencedAt?: string;
  updatedAt?: string;
  isVerified: boolean;
}

export interface TrustpilotReviewsResponse {
  reviews: TrustpilotReview[];
  links: {
    self: string;
    next?: string;
    prev?: string;
  };
}

export interface TrustpilotBusinessUnit {
  id: string;
  displayName: string;
  score: {
    stars: number;
    trustScore: number;
  };
  numberOfReviews: {
    total: number;
    usedForTrustScoreCalculation: number;
  };
}
```

### 3.4 Create Trustpilot Client
Create `lib/trustpilot/client.ts`:
```typescript
import axios from 'axios';
import { TrustpilotReviewsResponse, TrustpilotBusinessUnit } from './types';

class TrustpilotClient {
  private baseURL = 'https://api.trustpilot.com/v1';
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(
    private apiKey: string,
    private apiSecret: string,
    private businessUnitId: string
  ) {}

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid token
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${this.baseURL}/oauth/oauth-business-users-for-applications/accesstoken`,
        'grant_type=client_credentials',
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
      // Set expiry 5 minutes before actual expiry
      this.tokenExpiry = new Date(Date.now() + (response.data.expires_in - 300) * 1000);
      
      return this.accessToken;
    } catch (error) {
      console.error('Failed to get Trustpilot access token:', error);
      throw new Error('Failed to authenticate with Trustpilot');
    }
  }

  async getReviews(options?: {
    page?: number;
    perPage?: number;
    stars?: number[];
    language?: string;
  }): Promise<TrustpilotReviewsResponse> {
    const token = await this.getAccessToken();
    
    const params = new URLSearchParams({
      page: (options?.page || 1).toString(),
      perPage: (options?.perPage || 20).toString(),
      orderBy: 'createdat.desc',
    });

    if (options?.stars) {
      params.append('stars', options.stars.join(','));
    }
    if (options?.language) {
      params.append('language', options.language);
    }

    const response = await axios.get(
      `${this.baseURL}/business-units/${this.businessUnitId}/reviews?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }

  async getBusinessUnit(): Promise<TrustpilotBusinessUnit> {
    const token = await this.getAccessToken();
    
    const response = await axios.get(
      `${this.baseURL}/business-units/${this.businessUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  }
}

// Create singleton instance
let trustpilotClient: TrustpilotClient | null = null;

export function getTrustpilotClient() {
  if (!trustpilotClient) {
    if (!process.env.TRUSTPILOT_API_KEY || 
        !process.env.TRUSTPILOT_API_SECRET || 
        !process.env.TRUSTPILOT_BUSINESS_UNIT_ID) {
      throw new Error('Trustpilot credentials not configured');
    }

    trustpilotClient = new TrustpilotClient(
      process.env.TRUSTPILOT_API_KEY,
      process.env.TRUSTPILOT_API_SECRET,
      process.env.TRUSTPILOT_BUSINESS_UNIT_ID
    );
  }

  return trustpilotClient;
}
```

## Step 4: Create Reviews Component

### 4.1 Create Reviews Display Component
Create `components/TrustpilotReviews.tsx`:
```typescript
import { TrustpilotReview } from '@/lib/trustpilot/types';

interface TrustpilotReviewsProps {
  reviews: TrustpilotReview[];
  showTotal?: number;
}

export default function TrustpilotReviews({ 
  reviews, 
  showTotal = 5 
}: TrustpilotReviewsProps) {
  const displayReviews = reviews.slice(0, showTotal);

  return (
    <div className="my-8">
      <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
      
      <div className="space-y-4">
        {displayReviews.map((review) => (
          <div key={review.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-5 h-5 ${i < review.stars ? 'text-green-600 fill-current' : 'text-gray-300'}`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                      </svg>
                    ))}
                  </div>
                  <span className="font-semibold">{review.consumer.displayName}</span>
                  {review.isVerified && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                {review.consumer.displayLocation && (
                  <p className="text-sm text-gray-500">{review.consumer.displayLocation}</p>
                )}
              </div>
              <time className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString()}
              </time>
            </div>
            
            {review.title && (
              <h3 className="font-semibold mb-1">{review.title}</h3>
            )}
            
            <p className="text-gray-700">{review.text}</p>
          </div>
        ))}
      </div>

      {reviews.length === 0 && (
        <p className="text-gray-500 text-center py-8">No reviews yet</p>
      )}
    </div>
  );
}
```

### 4.2 Create Summary Component
Create `components/TrustpilotSummary.tsx`:
```typescript
interface TrustpilotSummaryProps {
  stars: number;
  trustScore: number;
  totalReviews: number;
}

export default function TrustpilotSummary({ 
  stars, 
  trustScore, 
  totalReviews 
}: TrustpilotSummaryProps) {
  return (
    <div className="bg-gray-50 rounded-lg p-6 text-center">
      <div className="flex justify-center mb-2">
        {[...Array(5)].map((_, i) => (
          <svg
            key={i}
            className={`w-8 h-8 ${i < Math.round(stars) ? 'text-green-600 fill-current' : 'text-gray-300'}`}
            viewBox="0 0 20 20"
          >
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
          </svg>
        ))}
      </div>
      <p className="text-lg font-semibold mb-1">
        {stars.toFixed(1)} out of 5
      </p>
      <p className="text-sm text-gray-600">
        Based on {totalReviews.toLocaleString()} reviews
      </p>
      <p className="text-xs text-gray-500 mt-2">
        Trust Score: {trustScore.toFixed(1)}
      </p>
    </div>
  );
}
```

## Step 5: Add Reviews to Your Pages

### 5.1 Add to Homepage
Update `app/page.tsx`:
```typescript
import { shopifyFetch } from '@/lib/shopify/client';
import { GET_ALL_PRODUCTS } from '@/lib/shopify/queries/products';
import { getTrustpilotClient } from '@/lib/trustpilot/client';
import TrustpilotReviews from '@/components/TrustpilotReviews';
import TrustpilotSummary from '@/components/TrustpilotSummary';
// ... other imports

export default async function Home() {
  // Fetch products
  const { products } = await shopifyFetch<ProductsResponse>({
    query: GET_ALL_PRODUCTS,
    variables: { first: 12 },
  });

  // Fetch Trustpilot reviews
  let trustpilotData = null;
  let businessUnit = null;
  
  try {
    const client = getTrustpilotClient();
    const [reviewsData, businessData] = await Promise.all([
      client.getReviews({ perPage: 5, stars: [4, 5] }), // Only 4-5 star reviews
      client.getBusinessUnit()
    ]);
    
    trustpilotData = reviewsData;
    businessUnit = businessData;
  } catch (error) {
    console.error('Failed to fetch Trustpilot data:', error);
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      {/* Products grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {/* ... existing product cards ... */}
      </div>

      {/* Trustpilot Section */}
      {businessUnit && (
        <section className="mt-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <TrustpilotSummary
                stars={businessUnit.score.stars}
                trustScore={businessUnit.score.trustScore}
                totalReviews={businessUnit.numberOfReviews.total}
              />
            </div>
            <div className="md:col-span-2">
              {trustpilotData && (
                <TrustpilotReviews reviews={trustpilotData.reviews} />
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
```

### 5.2 Add to Product Pages (Optional)
Update `app/products/[handle]/page.tsx` to show product-specific reviews if you're using Trustpilot Product Reviews.

## Step 6: Test Your Integration

### 6.1 Verify Environment Variables
Make sure all three Trustpilot variables are set in `.env.local`

### 6.2 Restart Development Server
```bash
npm run dev
```

### 6.3 Check the Homepage
Visit http://localhost:3000 and scroll down to see:
- Review summary with star rating
- Latest customer reviews
- Verified badge on verified reviews

## Step 7: Handle Edge Cases

### 7.1 Add Error Boundary
Create `components/TrustpilotError.tsx`:
```typescript
export default function TrustpilotError() {
  return (
    <div className="text-center py-8 text-gray-500">
      <p>Unable to load reviews at this time.</p>
      <a 
        href="https://www.trustpilot.com" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline mt-2 inline-block"
      >
        View all reviews on Trustpilot →
      </a>
    </div>
  );
}
```

### 7.2 Add Loading State
For client-side loading if needed.

## Troubleshooting

### Reviews Not Showing?
1. Check if Trustpilot app is properly installed in Shopify
2. Verify all environment variables are correct
3. Check browser console for errors
4. Ensure your Trustpilot account is active

### API Errors?
1. Verify API credentials are correct
2. Check if your Trustpilot plan includes API access
3. Look at server logs for detailed error messages

### No Reviews Yet?
1. Invite customers to leave reviews through Trustpilot
2. Set up automatic invitations in Trustpilot dashboard
3. Use test reviews in development

## Next Steps

1. **Style the reviews** to match your brand
2. **Add pagination** for more reviews
3. **Implement caching** to reduce API calls
4. **Add structured data** for SEO benefits
5. **Set up automatic review invitations** after orders

Your Trustpilot integration is now complete! 🎉