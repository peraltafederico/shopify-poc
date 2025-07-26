import { shopifyFetch } from '@/lib/shopify/client';
import { GET_PRODUCT_BY_HANDLE } from '@/lib/shopify/queries/products';
import { Product } from '@/lib/shopify/types';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import PageWrapper from '@/components/layout/PageWrapper';
import Link from 'next/link';

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
    <PageWrapper>
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-stone-500 mb-8">
        <Link href="/" className="hover:text-forest-600">
          Home
        </Link>
        <span>/</span>
        <span className="text-stone-900">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          {product.images.edges.map(({ node: image }, index) => (
            <div key={index} className="relative h-[500px] bg-gradient-to-br from-stone-100 to-stone-200 rounded-xl overflow-hidden shadow-lg">
              <Image
                src={image.url}
                alt={image.altText || product.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <h1 className="text-4xl font-display font-bold text-stone-900 mb-3">{product.title}</h1>
            <div className="flex items-baseline space-x-4">
              <p className="text-3xl font-bold text-earth-600">
                ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
              </p>
              <span className="text-sm text-stone-500">
                {product.priceRange.minVariantPrice.currencyCode}
              </span>
            </div>
          </div>

          <div className="prose prose-stone max-w-none">
            <p className="text-lg leading-relaxed text-stone-700">{product.description}</p>
          </div>

          {/* Features */}
          <div className="bg-gradient-to-r from-forest-50 to-sky-50 rounded-xl p-6 border border-forest-200">
            <h3 className="font-semibold text-stone-900 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2 text-forest-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Why Adventurers Love This
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li className="flex items-start">
                <span className="text-forest-500 mr-2">•</span>
                Built for extreme conditions
              </li>
              <li className="flex items-start">
                <span className="text-forest-500 mr-2">•</span>
                Sustainable materials
              </li>
              <li className="flex items-start">
                <span className="text-forest-500 mr-2">•</span>
                Lifetime warranty
              </li>
            </ul>
          </div>

          {/* Variants */}
          {product.variants.edges.length > 1 && (
            <div>
              <h3 className="font-semibold text-stone-900 mb-3">Available Options</h3>
              <div className="space-y-2">
                {product.variants.edges.map(({ node: variant }) => (
                  <div key={variant.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-stone-200 hover:border-forest-300 transition-colors">
                    <span className="font-medium text-stone-900">{variant.title}</span>
                    <span className={`text-sm font-medium ${variant.availableForSale ? 'text-forest-600' : 'text-stone-400'}`}>
                      {variant.availableForSale ? '✓ In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <button className="w-full bg-forest-600 text-white py-4 px-8 rounded-lg hover:bg-forest-700 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all">
              Add to Cart (Coming Soon)
            </button>
            <p className="text-center text-sm text-stone-500">
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}