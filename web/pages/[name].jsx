import { useRouter } from 'next/router'

import Container from '@material-ui/core/Container';

import { RequiresLogin } from '../components/Authenticated';
import Add from '../components/Add';


/**
 * Handles redirecting to a url, or creating
 * a new short entry for this name.
 */
export default  function namedLink() {
  const router = useRouter();
  const { name, url } = router.query;

  return (
    <RequiresLogin>
      <Add linkName={name} linkUrl={url} />
    </RequiresLogin>
  );
}
