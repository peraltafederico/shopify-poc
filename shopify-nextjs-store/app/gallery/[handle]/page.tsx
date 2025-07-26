import { shopifyFetch } from '@/lib/shopify/client';
import { GET_CUSTOMER_CLOSET_BY_HANDLE } from '@/lib/shopify/queries/metaobjects';
import { CustomerCloset } from '@/lib/shopify/types/metaobjects';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface ProjectResponse {
  metaobject: CustomerCloset;
}

export default async function CustomerClosetPage({ 
  params 
}: { 
  params: { handle: string } 
}) {
  try {
    const { metaobject } = await shopifyFetch<ProjectResponse>({
      query: GET_CUSTOMER_CLOSET_BY_HANDLE,
      variables: { handle: params.handle },
    });

    if (!metaobject) {
      notFound();
    }

    const customerName = metaobject.customer_name?.value || 'Customer';
    const projectTitle = metaobject.project_title?.value || 'Closet Project';
    const description = metaobject.description?.value;
    const testimonial = metaobject.testimonial?.value;
    const location = metaobject.location?.value;
    const projectDate = metaobject.project_date?.value;
    const beforeImage = metaobject.before_image?.reference?.image;
    const afterImage = metaobject.after_image?.reference?.image;
    const productsUsed = metaobject.products_used?.references?.edges || [];

    return (
      <main className="container mx-auto px-4 py-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
          <Link href="/" className="hover:text-gray-700">Home</Link>
          <span>/</span>
          <Link href="/gallery" className="hover:text-gray-700">Gallery</Link>
          <span>/</span>
          <span className="text-gray-900">{projectTitle}</span>
        </nav>

        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">{projectTitle}</h1>
          
          <div className="flex items-center gap-4 text-gray-600 mb-8">
            <span>{customerName}</span>
            {location && (
              <>
                <span>•</span>
                <span>{location}</span>
              </>
            )}
            {projectDate && (
              <>
                <span>•</span>
                <span>{new Date(projectDate).toLocaleDateString()}</span>
              </>
            )}
          </div>

          {/* Before/After Images */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {beforeImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Before</h3>
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={beforeImage.url}
                    alt={beforeImage.altText || 'Before'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
            
            {afterImage && (
              <div>
                <h3 className="text-lg font-semibold mb-2">After</h3>
                <div className="relative h-96 bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={afterImage.url}
                    alt={afterImage.altText || 'After'}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {description && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Project Details</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{description}</p>
            </div>
          )}

          {/* Testimonial */}
          {testimonial && (
            <div className="bg-gray-50 rounded-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4">Customer Testimonial</h2>
              <blockquote className="text-lg italic text-gray-700">
                "{testimonial}"
              </blockquote>
              <p className="mt-4 text-gray-600">— {customerName}</p>
            </div>
          )}

          {/* Products Used */}
          {productsUsed.length > 0 && (
            <div>
              <h2 className="text-2xl font-semibold mb-4">Products Used</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {productsUsed.map(({ node: product }) => (
                  <Link
                    key={product.id}
                    href={`/products/${product.handle}`}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h3 className="font-semibold">{product.title}</h3>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching customer closet:', error);
    notFound();
  }
}