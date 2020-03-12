import Container from '@material-ui/core/Container';

import Add from '../components/Add.jsx';
import { RequiresLogin } from '../components/Authenticated';

export default function Index() {
  return (
    <RequiresLogin>
      <Add />
    </RequiresLogin>
  );
}
