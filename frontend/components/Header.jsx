
import Avatar from '@material-ui/core/Avatar';
import Container from '@material-ui/core/Container';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Button from '@material-ui/core/Button';
import Link from 'next/link'

import { WhenLoggedIn } from '../components/Authenticated';

import css from './Header.module.scss';

export default function Header() {
  const headerButtonProps = {
    color: 'secondary',
    size: 'small',
    className: css.actionButton,
  }

  /**
   * Log the user out.
   */
  function logout() {
    gapi.auth2.getAuthInstance().signOut();
  }

  return (
    <Container component="main" maxWidth="xs" className={css.header}>
      <Link href="/">
        <a>
          <Avatar className={css.logoIcon}>
            <FastForwardIcon />
          </Avatar>
        </a>
      </Link>
      <div className={css.actions}>
        <WhenLoggedIn>
          <Link href="/">
            <Button {...headerButtonProps}>
              Add
            </Button>
          </Link>
          <Link href="/_/links">
            <Button {...headerButtonProps}>
              Links
            </Button>
          </Link>
          <Button
            {...headerButtonProps}
            onClick={logout}
          >
            Logout
          </Button>
        </WhenLoggedIn>
      </div>
    </Container>
  );
}