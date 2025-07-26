import { shopifyFetch } from '@/lib/shopify/client';
import { GET_CUSTOMER_CLOSETS } from '@/lib/shopify/queries/metaobjects';
import { MetaobjectsResponse } from '@/lib/shopify/types/metaobjects';
import CustomerClosetCard from '@/components/CustomerClosetCard';
import PageWrapper from '@/components/layout/PageWrapper';
import Link from 'next/link';

export default async function GalleryPage() {
  let customerClosets = [];
  
  try {
    const response = await shopifyFetch<MetaobjectsResponse>({
      query: GET_CUSTOMER_CLOSETS,
      variables: { first: 20 },
    });
    
    customerClosets = response.metaobjects.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Error fetching customer closets:', error);
  }

  return (
    <PageWrapper>
      <div className="mb-12">
        <h1 className="text-5xl font-display font-bold text-stone-900 mb-4">
          Adventure Gallery
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl">
          Witness the incredible journeys our community has embarked upon with their trusted gear.
        </p>
      </div>

      {customerClosets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customerClosets.map((closet) => (
            <CustomerClosetCard key={closet.id} closet={closet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-semibold text-stone-900 mb-4">
            Adventures Coming Soon
          </h2>
          <p className="text-stone-600 mb-8 max-w-md mx-auto text-lg">
            Our community's epic journeys will be showcased here. Be the first to share your story!
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-earth-600 text-white rounded-lg hover:bg-earth-700 transition-colors font-medium"
          >
            Start Your Journey
          </Link>
        </div>
      )}
    </PageWrapper>
  );
}