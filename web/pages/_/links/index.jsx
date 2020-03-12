import Container from '@material-ui/core/Container';

import LinkList from '../../../components/LinkList.jsx';
import { RequiresLogin } from '../../../components/Authenticated';

export default function Index() {
  return (
    <RequiresLogin>
      <LinkList />
    </RequiresLogin>
  );
}
