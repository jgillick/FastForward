import Add from '../components/Add';
import { RequiresLogin } from '../components/Authenticated';

export default function Index() {
  return (
    <RequiresLogin>
      <Add />
    </RequiresLogin>
  );
}
