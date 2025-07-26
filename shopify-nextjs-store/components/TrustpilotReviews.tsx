import { TrustpilotReview } from '@/lib/trustpilot/types';

interface TrustpilotReviewsProps {
  reviews: TrustpilotReview[];
  showTotal?: number;
}

export default function TrustpilotReviews({ 
  reviews, 
  showTotal 
}: TrustpilotReviewsProps) {
  const displayReviews = showTotal ? reviews.slice(0, showTotal) : reviews;

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          className="mx-auto h-12 w-12 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-4l-4 4z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No reviews yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Be the first to share your experience with us.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayReviews.map((review) => (
        <div key={review.id} className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
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
                <span className="font-semibold text-gray-900">{review.consumer.displayName}</span>
                {review.isVerified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                )}
              </div>
              {review.consumer.displayLocation && (
                <p className="text-sm text-gray-500">{review.consumer.displayLocation}</p>
              )}
            </div>
            <time className="text-sm text-gray-500">
              {new Date(review.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </time>
          </div>
          
          {review.title && (
            <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
          )}
          
          <p className="text-gray-700 leading-relaxed">{review.text}</p>
          
          {review.experiencedAt && review.experiencedAt !== review.createdAt && (
            <p className="text-xs text-gray-500 mt-4">
              Experience date: {new Date(review.experiencedAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}