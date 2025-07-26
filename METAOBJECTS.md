# Shopify Metaobjects Integration Guide

## What are Metaobjects?

Metaobjects are custom data structures in Shopify that allow you to create and manage structured content beyond standard products and collections. They're perfect for:
- Customer testimonials/case studies
- FAQ sections
- Team members
- Store locations
- Custom content types

## Step 1: Create Metaobjects in Shopify

### 1.1 Define Your Metaobject
1. In Shopify Admin, go to **Settings** → **Custom data**
2. Click **Metaobjects**
3. Click **Add definition**

### 1.2 Example: Customer Closets
For your `real_customer_closets` example, create:

```
Name: Real Customer Closets
Type: real_customer_closets

Fields:
- customer_name (Single line text)
- project_title (Single line text)
- description (Multi-line text)
- before_image (File - Image)
- after_image (File - Image)
- testimonial (Multi-line text)
- project_date (Date)
- location (Single line text)
- products_used (List of products)
```

### 1.3 Add Entries
1. After creating the definition, click **Add entry**
2. Fill in the fields for each customer closet project
3. Save

## Step 2: Enable Storefront API Access

### 2.1 Make Metaobjects Accessible
1. In the metaobject definition, find **Storefront API access**
2. Enable **Storefront API access**
3. Select which fields should be accessible via the API

### 2.2 Note Your Type Name
The type name will be something like `real_customer_closets` (Shopify may modify it)

## Step 3: Create GraphQL Queries

### 3.1 Add Metaobject Types
Create `lib/shopify/types/metaobjects.ts`:

```typescript
export interface CustomerCloset {
  id: string;
  handle: string;
  type: string;
  customer_name?: {
    value: string;
  };
  project_title?: {
    value: string;
  };
  description?: {
    value: string;
  };
  before_image?: {
    reference?: {
      image?: {
        url: string;
        altText?: string;
        width: number;
        height: number;
      };
    };
  };
  after_image?: {
    reference?: {
      image?: {
        url: string;
        altText?: string;
        width: number;
        height: number;
      };
    };
  };
  testimonial?: {
    value: string;
  };
  project_date?: {
    value: string;
  };
  location?: {
    value: string;
  };
  products_used?: {
    references?: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          handle: string;
        };
      }>;
    };
  };
}

export interface MetaobjectsResponse {
  metaobjects: {
    edges: Array<{
      node: CustomerCloset;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      endCursor?: string;
    };
  };
}
```

### 3.2 Create Metaobject Queries
Create `lib/shopify/queries/metaobjects.ts`:

```typescript
export const GET_CUSTOMER_CLOSETS = `
  query GetCustomerClosets($first: Int = 10, $after: String) {
    metaobjects(type: "real_customer_closets", first: $first, after: $after) {
      edges {
        node {
          id
          handle
          type
          customer_name: field(key: "customer_name") {
            value
          }
          project_title: field(key: "project_title") {
            value
          }
          description: field(key: "description") {
            value
          }
          before_image: field(key: "before_image") {
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          after_image: field(key: "after_image") {
            reference {
              ... on MediaImage {
                image {
                  url
                  altText
                  width
                  height
                }
              }
            }
          }
          testimonial: field(key: "testimonial") {
            value
          }
          project_date: field(key: "project_date") {
            value
          }
          location: field(key: "location") {
            value
          }
          products_used: field(key: "products_used") {
            references(first: 10) {
              edges {
                node {
                  ... on Product {
                    id
                    title
                    handle
                  }
                }
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const GET_CUSTOMER_CLOSET_BY_HANDLE = `
  query GetCustomerClosetByHandle($handle: String!) {
    metaobject(handle: { handle: $handle, type: "real_customer_closets" }) {
      id
      handle
      type
      customer_name: field(key: "customer_name") {
        value
      }
      project_title: field(key: "project_title") {
        value
      }
      description: field(key: "description") {
        value
      }
      before_image: field(key: "before_image") {
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      after_image: field(key: "after_image") {
        reference {
          ... on MediaImage {
            image {
              url
              altText
              width
              height
            }
          }
        }
      }
      testimonial: field(key: "testimonial") {
        value
      }
      project_date: field(key: "project_date") {
        value
      }
      location: field(key: "location") {
        value
      }
      products_used: field(key: "products_used") {
        references(first: 10) {
          edges {
            node {
              ... on Product {
                id
                title
                handle
                images(first: 1) {
                  edges {
                    node {
                      url
                      altText
                    }
                  }
                }
                priceRange {
                  minVariantPrice {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;
```

## Step 4: Create Components

### 4.1 Customer Closet Card Component
Create `components/CustomerClosetCard.tsx`:

```typescript
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
```

### 4.2 Gallery Page
Create `app/gallery/page.tsx`:

```typescript
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
          <p className="text-gray-500">No customer projects available yet.</p>
        </div>
      )}
    </main>
  );
}
```

### 4.3 Individual Project Page
Create `app/gallery/[handle]/page.tsx`:

```typescript
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
```

## Step 5: Add Navigation

Update your navigation to include the gallery link:

```typescript
// In app/layout.tsx, add to navigation:
<a href="/gallery" className="hover:text-gray-600">Gallery</a>
```

## Common Metaobject Patterns

### 1. FAQ Section
```graphql
metaobjects(type: "faq_items", first: 20) {
  edges {
    node {
      question: field(key: "question") { value }
      answer: field(key: "answer") { value }
      category: field(key: "category") { value }
    }
  }
}
```

### 2. Team Members
```graphql
metaobjects(type: "team_members", first: 10) {
  edges {
    node {
      name: field(key: "name") { value }
      role: field(key: "role") { value }
      bio: field(key: "bio") { value }
      photo: field(key: "photo") {
        reference {
          ... on MediaImage {
            image { url altText }
          }
        }
      }
    }
  }
}
```

### 3. Store Locations
```graphql
metaobjects(type: "store_locations", first: 20) {
  edges {
    node {
      name: field(key: "name") { value }
      address: field(key: "address") { value }
      phone: field(key: "phone") { value }
      hours: field(key: "hours") { value }
      coordinates: field(key: "coordinates") { value }
    }
  }
}
```

## Best Practices

1. **Field Keys**: Always use the exact field key as defined in Shopify
2. **Type Safety**: Create TypeScript interfaces for your metaobjects
3. **Error Handling**: Always handle cases where metaobjects might not exist
4. **Performance**: Use pagination for large datasets
5. **Caching**: Consider caching metaobject data as it changes less frequently

## Troubleshooting

### Metaobjects Not Showing?
1. Ensure Storefront API access is enabled
2. Check the metaobject type name matches exactly
3. Verify field keys are correct
4. Make sure entries are published

### GraphQL Errors?
1. Test queries in Shopify GraphiQL explorer
2. Check field permissions
3. Verify reference field types

Your metaobjects are now integrated! Access them at `/gallery` to see customer closet projects.