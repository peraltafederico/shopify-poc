import { fetchTrustpilotReviews } from '@/lib/trustpilot/client';
import TrustpilotReviews from '@/components/TrustpilotReviews';
import TrustpilotSummary from '@/components/TrustpilotSummary';
import Link from 'next/link';

export default async function ReviewsPage() {
  // Fetch Trustpilot data - will return empty if no credentials
  const { reviews, businessUnit } = await fetchTrustpilotReviews({
    perPage: 20
  });

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">Customer Reviews</span>
      </nav>

      <h1 className="text-4xl font-bold mb-8">Customer Reviews</h1>

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
              
              <div className="mt-6 bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Share Your Experience</h3>
                <p className="text-sm text-gray-600 mb-3">
                  We value your feedback and would love to hear about your experience with our products.
                </p>
                <a
                  href="https://www.trustpilot.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Write a Review
                </a>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold">
                What Our Customers Say
              </h2>
              <p className="text-gray-600 mt-1">
                Real reviews from verified customers
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
              className="mx-auto h-24 w-24 text-gray-300"
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
          
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No Reviews Yet
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            We're just getting started! Be among the first to share your experience with our products and help others make informed decisions.
          </p>
          
          <div className="space-y-4">
            <Link
              href="/"
              className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              Continue Shopping
            </Link>
            
            <p className="text-sm text-gray-500">
              Reviews will appear here once customers start sharing their feedback
            </p>
          </div>
        </div>
      )}
    </main>
  );
}