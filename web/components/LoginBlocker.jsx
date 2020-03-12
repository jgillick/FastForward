import { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import { GoogleLogin } from 'react-google-login';

import css from './LoginBlocker.module.scss';


export default function LoginBlocker() {
  const [error, setError] = useState(false);

  /**
   * Login failure
   */
  function onFailure(response) {
    console.error('Login failure', response);
    if (response.error !== 'popup_closed_by_user') {
      setError('Could not log you in.');
    }
  }

  /**
   * Don't do anything on success, the Authenticated component should register the login change.
   */
  const onSuccess = () => {};

  return (
    <Container component="main" maxWidth="xs" className={css.container}>
      <Typography variant="h2" className={css.header}>
        Login to continue
      </Typography>
      { error && (
        <Alert severity="error" variant="filled" className={css.error}>
          {error}
        </Alert>
      )}
      <GoogleLogin
        className={css.loginButton}
        clientId={process.env.GOOGLE_CLIENT_ID}
        buttonText="Login with Google"
        theme="dark"
        offline={true}
        cookiePolicy="single_host_origin"
        onSuccess={onSuccess}
        onFailure={onFailure}
      />
    </Container>
  )
}
