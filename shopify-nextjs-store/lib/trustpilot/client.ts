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

    const response = await fetch(
      `${this.baseURL}/oauth/oauth-business-users-for-applications/accesstoken`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64')
        },
        body: 'grant_type=client_credentials'
      }
    );

    if (!response.ok) {
      throw new Error('Failed to authenticate with Trustpilot');
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Set expiry 5 minutes before actual expiry
    this.tokenExpiry = new Date(Date.now() + (data.expires_in - 300) * 1000);
    
    return this.accessToken;
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

    const response = await fetch(
      `${this.baseURL}/business-units/${this.businessUnitId}/reviews?${params}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch reviews');
    }

    return response.json();
  }

  async getBusinessUnit(): Promise<TrustpilotBusinessUnit> {
    const token = await this.getAccessToken();
    
    const response = await fetch(
      `${this.baseURL}/business-units/${this.businessUnitId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch business unit');
    }

    return response.json();
  }
}

// Create singleton instance
let trustpilotClient: TrustpilotClient | null = null;

export function getTrustpilotClient() {
  // Check if credentials are configured
  if (!process.env.TRUSTPILOT_API_KEY || 
      !process.env.TRUSTPILOT_API_SECRET || 
      !process.env.TRUSTPILOT_BUSINESS_UNIT_ID) {
    return null;
  }

  if (!trustpilotClient) {
    trustpilotClient = new TrustpilotClient(
      process.env.TRUSTPILOT_API_KEY,
      process.env.TRUSTPILOT_API_SECRET,
      process.env.TRUSTPILOT_BUSINESS_UNIT_ID
    );
  }

  return trustpilotClient;
}

// Safe fetch function that returns empty data on error
export async function fetchTrustpilotReviews(options?: {
  page?: number;
  perPage?: number;
  stars?: number[];
}): Promise<{ reviews: TrustpilotReviewsResponse | null; businessUnit: TrustpilotBusinessUnit | null }> {
  try {
    const client = getTrustpilotClient();
    
    if (!client) {
      console.log('Trustpilot credentials not configured');
      return { reviews: null, businessUnit: null };
    }

    const [reviewsData, businessData] = await Promise.all([
      client.getReviews(options),
      client.getBusinessUnit()
    ]);

    return { reviews: reviewsData, businessUnit: businessData };
  } catch (error) {
    console.error('Error fetching Trustpilot data:', error);
    return { reviews: null, businessUnit: null };
  }
}