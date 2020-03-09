import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';

import { WhenLoggedIn, WhenLoggedOut } from '../components/Authenticated';
import Add from '../components/Add';
import LoginBlocker from '../components/LoginBlocker';


/**
 * Handles redirecting to a url, or creating
 * a new short entry for this name.
 */
export default  function namedLink() {
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
