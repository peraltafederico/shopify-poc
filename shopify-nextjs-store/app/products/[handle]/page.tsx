import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';

interface ProductResponse {
  product: Product & {
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          availableForSale: boolean;
          price: {
            amount: string;
            currencyCode: string;
          };
        };
      }>;
    };
  };
}

export default async function ProductPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  const { product } = await shopifyFetch<ProductResponse>({
    query: GET_PRODUCT_BY_HANDLE,
    variables: { handle: params.handle },
  });

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          {product.images.edges.map(({ node: image }, index) => (
            <div key={index} className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.title}</h1>
            <p className="text-2xl text-gray-700">
              ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              {' '}{product.priceRange.minVariantPrice.currencyCode}
            </p>
          </div>

          <div className="prose max-w-none">
            <p>{product.description}</p>
          </div>

          {/* Variants */}
          {product.variants.edges.length > 1 && (
            <div>
              <h3 className="font-semibold mb-2">Options:</h3>
              <div className="space-y-2">
                {product.variants.edges.map(({ node: variant }) => (
                  <div key={variant.id} className="flex items-center justify-between p-2 border rounded">
                    <span>{variant.title}</span>
                    <span className="text-sm text-gray-600">
                      {variant.availableForSale ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button className="w-full bg-black text-white py-3 px-6 rounded-lg hover:bg-gray-800 transition-colors">
            Add to Cart (Coming Soon)
          </button>
        </div>
      </div>
    </main>
  );
}