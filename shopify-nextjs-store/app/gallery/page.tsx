import { shopifyFetch } from '@/lib/shopify/client';
import { GET_CUSTOMER_CLOSETS } from '@/lib/shopify/queries/metaobjects';
import { MetaobjectsResponse } from '@/lib/shopify/types/metaobjects';
import CustomerClosetCard from '@/components/CustomerClosetCard';
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
    <main className="container mx-auto px-4 py-8">
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-700">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900">Customer Gallery</span>
      </nav>

      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Real Customer Closets</h1>
        <p className="text-lg text-gray-600">
          See how our customers have transformed their spaces with our custom closet solutions.
        </p>
      </div>

      {customerClosets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {customerClosets.map((closet) => (
            <CustomerClosetCard key={closet.id} closet={closet} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            No Gallery Items Yet
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Customer closet projects will appear here once they're added in Shopify as metaobjects.
          </p>
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Browse Products
          </Link>
        </div>
      )}
    </main>
  );
}