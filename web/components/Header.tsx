
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Container from '@material-ui/core/Container';
import FastForwardIcon from '@material-ui/icons/FastForward';
import Button from '@material-ui/core/Button';
import { ButtonProps } from "@material-ui/core/Button";
import Link from 'next/link'

import { WhenLoggedIn, WhenLoggedOut } from '../components/Authenticated';

import css from './Header.module.scss';

export default function Header() {
  const headerButtonProps:ButtonProps = {
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
          <Tooltip
            title="FastForward Links"
            placement="right"
            leaveDelay={100}
            enterDelay={200}
          >
            <Avatar className={css.logoIcon}>
              <FastForwardIcon />
            </Avatar>
          </Tooltip>
        </a>
      </Link>
      <div className={css.actions}>
        <WhenLoggedOut>
          <Link href="/">
            <Button {...headerButtonProps}>
              Login
            </Button>
          </Link>
        </WhenLoggedOut>
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
        </WhenLoggedIn>
        <Link href="/_/about">
          <Button
            {...headerButtonProps}
            onClick={logout}
          >
            About
          </Button>
        </Link>
        <WhenLoggedIn>
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
