import { shopifyFetch } from '@/lib/shopify/client';
import { GET_ALL_PRODUCTS } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Link from 'next/link';
import Image from 'next/image';

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
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Our Products</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.edges.map(({ node: product }) => (
          <Link
            key={product.id}
            href={`/products/${product.handle}`}
            className="group"
          >
            <div className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
              {product.images.edges[0] && (
                <div className="relative h-64 bg-gray-100">
                  <Image
                    src={product.images.edges[0].node.url}
                    alt={product.images.edges[0].node.altText || product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2">{product.title}</h2>
                <p className="text-gray-600">
                  ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  {' '}{product.priceRange.minVariantPrice.currencyCode}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}