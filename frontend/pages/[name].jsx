import url from 'url';
import gql from 'graphql-tag'
import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';

import { createApolloClient, getGraphqlErrors } from '../apollo/client';

import { WhenLoggedIn, WhenLoggedOut } from '../components/Authenticated';
import Add from '../components/Add';
import LoginBlocker from '../components/LoginBlocker';

const LINK_QUERY = gql`
  query LinksQuery(
    $name: String!,
  ) {
    link(name: $name) {
      url,
      currentRevision {
        id
      }
    }
  }
`;
const REDIRECT_LOG = gql`
  mutation addRedirectLog(
    $ip: String!,
    $link: String!,
    $userAgent: String,
  ) {
    addRedirectLog (
      ip: $ip,
      link: $link,
      userAgent: $userAgent,
    ) {
      id
    }
  }
`;


/**
 * Handles redirecting to a url, or creating
 * a new short entry for this name.
 */
function redirectHandler() {
  const router = useRouter();
  const { name, url } = router.query;

  return (
    <Container maxWidth="lg">
      <WhenLoggedIn>
        <Add linkName={name} linkUrl={url} />
      </WhenLoggedIn>
      <WhenLoggedOut>
        <LoginBlocker />
      </WhenLoggedOut>
    </Container>
  );
}
redirectHandler.getInitialProps = async ({ req, res, asPath }) => {
  if (!res) {
    return null;
  }

  const errorHandler = (e) => {
    console.error('Redirect Error:', e);
    console.error('GraphQL Errors', getGraphqlErrors(e));
  };

  try {
    const name = url.parse(asPath).pathname.substr(1);

    // Get link
    const apolloClient = createApolloClient();
    const { data } = await apolloClient.query({
      query: LINK_QUERY,
      variables: { name },
    });

    // Redirect
    if (data) {
      try {
        // Add redirect log (fire and forget)
        await apolloClient.mutate({
          mutation: REDIRECT_LOG,
          variables: {
            link: name,
            revision: data.link.currentRevision.id,
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
          }
        });
      } catch(e) {
        errorHandler(e);
      }

      // Make redirect
      res.writeHead(302, {
        Location: data.link.url,
      });
      res.end();
    }
  } catch(e) {
    // If link not found, no need to log error
    const notFound = getGraphqlErrors(e).find((i) => i === 'LINK_NOT_FOUND');
    if (!notFound) {
      errorHandler(e);
    }
  }
};

export default redirectHandler;
