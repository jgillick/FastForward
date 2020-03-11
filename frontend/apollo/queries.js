
import gql from 'graphql-tag'

/**
 * List all links
 */
export const LINKS_QUERY = gql`
  query LinksQuery(
    $oAuthIdToken: String!,
    $query: String,
  ) {
    links(oAuthIdToken: $oAuthIdToken, query: $query) {
      name
      url
      createdAt
      user {
        name
        picture
      }
    }
  }
`;

/**
 * Return a single link
 */
export const LINK_QUERY = gql`
  query LinksQuery(
    $name: String!,
  ) {
    link(
      name: $name,
    ) {
      name
      url
      updatedAt
      user {
        name
        picture
      }
      history {
        id
        url
        createdAt
        user {
          name
          picture
        }
      }
    }
  }
`;

/**
 * Add a new link
 */
export const CREATE_LINK = gql`
  mutation CreateLink(
    $url: String!,
    $name: String!,
    $oAuthIdToken: String!,
  ) {
    createLink (
      url: $url
      name: $name
      oAuthIdToken: $oAuthIdToken
    ) {
      name
      url
    }
  }
`;
