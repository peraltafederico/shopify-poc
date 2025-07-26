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