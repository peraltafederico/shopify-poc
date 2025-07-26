import { shopifyFetch } from '@/lib/shopify/client';
import { GET_ALL_PRODUCTS } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Link from 'next/link';
import Image from 'next/image';
import PageWrapper from '@/components/layout/PageWrapper';

interface ProductsResponse {
  products: {
    edges: Array<{
      node: Product;
    }>;
  };
}

export default async function Home() {
  const { products } = await shopifyFetch<ProductsResponse>({
    query: GET_ALL_PRODUCTS,
    variables: { first: 12 },
  });

  return (
    <PageWrapper>
      <div className="mb-12">
        <h1 className="text-5xl font-display font-bold text-stone-900 mb-4">
          Discover Your Next Adventure
        </h1>
        <p className="text-xl text-stone-600 max-w-3xl">
          Explore our curated collection of nature-inspired gear, designed to fuel your passion for the great outdoors.
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-8">
        {products.edges.map(({ node: product }) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group"
          >
            <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              {product.images.edges[0] && (
                <div className="relative h-72 bg-gradient-to-br from-stone-100 to-stone-200">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              )}
              <div className="p-6">
                <h2 className="font-semibold text-lg text-stone-900 mb-2 group-hover:text-forest-700 transition-colors">
                  {product.title}
                </h2>
                <div className="flex items-baseline justify-between">
                  <p className="text-earth-600 font-bold text-xl">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                  <span className="text-sm text-stone-500">
                    {product.priceRange.minVariantPrice.currencyCode}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </PageWrapper>
  );
}