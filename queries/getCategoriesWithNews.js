import { gql } from "@apollo/client";

export const GET_CATEGORIES_WITH_NEWS = gql`
  query {
    categories {
      id
      name
      slug
      image
      subcategories {
        id
        name
        slug
        image
        news {
          id
          title
          image
          slug
          content
          publishDate
          tags {
            id
            name
            slug
          }
         
        }
      }
    }
  }
`;
