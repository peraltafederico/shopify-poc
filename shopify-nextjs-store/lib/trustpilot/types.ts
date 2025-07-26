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