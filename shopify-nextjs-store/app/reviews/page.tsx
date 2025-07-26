import { fetchTrustpilotReviews } from '@/lib/trustpilot/client';
import TrustpilotReviews from '@/components/TrustpilotReviews';
import TrustpilotSummary from '@/components/TrustpilotSummary';
import PageWrapper from '@/components/layout/PageWrapper';
import Link from 'next/link';

export default async function ReviewsPage() {
  // Fetch Trustpilot data - will return empty if no credentials
  const { reviews, businessUnit } = await fetchTrustpilotReviews({
    perPage: 20
  });

  return (
    <PageWrapper>
      <div className="mb-12">
        <h1 className="text-5xl font-display font-bold text-stone-900 mb-4">
          Customer Reviews
        </h1>
        <p className="text-xl text-stone-600">
          Real experiences from our community of adventurers
        </p>
      </div>

      {businessUnit && reviews ? (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Summary Section */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <TrustpilotSummary
                stars={businessUnit.score.stars}
                trustScore={businessUnit.score.trustScore}
                totalReviews={businessUnit.numberOfReviews.total}
                businessName={businessUnit.displayName}
              />
              
              <div className="mt-6 bg-gradient-to-br from-forest-50 to-earth-50 rounded-xl p-6 border border-forest-200">
                <h3 className="font-semibold text-stone-900 mb-2">Share Your Adventure</h3>
                <p className="text-sm text-stone-600 mb-3">
                  Your stories inspire others to explore. Share your experience with our gear.
                </p>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors"
                >
                  Write a Review
                </a>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-stone-900">
                Stories from the Trail
              </h2>
              <p className="text-stone-600 mt-1">
                Authentic reviews from verified adventurers
              </p>
            </div>
            
            <TrustpilotReviews reviews={reviews.reviews} />
          </div>
        </div>
      ) : (
        /* Empty State */
        <div className="max-w-2xl mx-auto text-center py-16">
          <div className="mb-8">
            <svg
              className="mx-auto h-24 w-24 text-stone-300 animate-float"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          </div>
          
          <h2 className="text-3xl font-display font-semibold text-stone-900 mb-4">
            The Journey Begins Here
          </h2>
          
          <p className="text-stone-600 mb-8 max-w-md mx-auto text-lg">
            Be the first to share your adventure story. Your experience helps guide fellow explorers on their path.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-8 py-3 bg-forest-600 text-white rounded-lg hover:bg-forest-700 transition-colors font-medium"
            >
              Explore Our Gear
            </Link>
            
            <p className="text-sm text-stone-500">
              Reviews will bloom here as our community grows
            </p>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}