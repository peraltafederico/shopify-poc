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