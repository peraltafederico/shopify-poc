import Image from 'next/image';
import Link from 'next/link';
import { CustomerCloset } from '@/lib/shopify/types/metaobjects';

interface CustomerClosetCardProps {
  closet: CustomerCloset;
}

export default function CustomerClosetCard({ closet }: CustomerClosetCardProps) {
  const customerName = closet.customer_name?.value || 'Customer';
  const projectTitle = closet.project_title?.value || 'Closet Project';
  const location = closet.location?.value;
  const beforeImage = closet.before_image?.reference?.image;
  const afterImage = closet.after_image?.reference?.image;

  return (
    <Link href={`/gallery/${closet.handle}`} className="group block">
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        {/* Before/After Images */}
        <div className="relative h-64">
          {afterImage ? (
            <Image
              src={afterImage.url}
              alt={afterImage.altText || `${projectTitle} - After`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image</span>
            </div>
          )}
          
          {/* Before image overlay on hover */}
          {beforeImage && (
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Image
                src={beforeImage.url}
                alt={beforeImage.altText || `${projectTitle} - Before`}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white px-2 py-1 text-sm rounded">
                Before
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg mb-1">{projectTitle}</h3>
          <p className="text-gray-600 text-sm mb-2">{customerName}</p>
          {location && (
            <p className="text-gray-500 text-sm flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {location}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}