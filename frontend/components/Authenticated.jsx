import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag'

import Alert from '@material-ui/lab/Alert';

import { withApollo } from '../apollo/client'

export const AuthContext = React.createContext(null);

const LOGIN_USER = gql`
  mutation Login(
    $oAuthIdToken: String!,
  ) {
    login (
      oAuthIdToken: $oAuthIdToken
    ) {
      id
      name
    }
  }
`;

const Authenticated = withApollo((props) => {
  const [isSignedIn, setSigninStatus] = useState(null);
  const [oAuthIdToken, setOAuthID] = useState(null);
  const [loginError, setLoginError] = useState(null);
  const [loginUser, loginResponse] = useMutation(LOGIN_USER);

  /**
   * Get the Google OAuth ID
   */
  const getOauthID = () =>
    gapi.auth2?.getAuthInstance()?.currentUser.get().getAuthResponse().id_token;

  /**
   * Load auth client when component mounts.
   */
  useEffect(function onMount() {
    gapi.load('auth2', getAuthentication);
  }, []);

  /**
   * On backend login error
   */
  useEffect(() => {
    if (!loginResponse.error) {
      return;
    }
    setSigninStatus(false);
    setLoginError('We hit a problem trying to log you in with the backend.');
  }, [loginResponse.error]);

  /**
   * On backend login success
   */
  useEffect(() => {
    if (!loginResponse.data) {
      return;
    }
    setOAuthID(getOauthID());
    setSigninStatus(true);
  }, [loginResponse.data]);

  /**
   * Check authentication status
   */
  function getAuthentication() {
    gapi.auth2.init({
      clientId: process.env.GOOGLE_CLIENT_ID,
    }).then(function () {
      // Handle the initial sign-in state.
      const googleAuth = gapi.auth2.getAuthInstance();
      const signinStatus = googleAuth.isSignedIn.get();
      handleGoogleAuthChange(signinStatus);

      // Listen for sign-in state changes.
      googleAuth.isSignedIn.listen(handleGoogleAuthChange);
    });
  }


  /**
   * Fired when the login status changes
   */
  function handleGoogleAuthChange(isSignedIn) {
    if (!isSignedIn) {
      setSigninStatus(false);
    } else {
      loginUser({
        variables: { oAuthIdToken: getOauthID() }
      });
    }
  }

  return (
    <AuthContext.Provider value={{
      isSignedIn,
      oAuthIdToken,
    }}>
      { loginError && (
        <Alert severity="error" variant="filled">
          {loginError}
        </Alert>
      )}
      {props.children}
    </AuthContext.Provider>
  );
});
Authenticated.Consumer = AuthContext.Consumer;

/**
 * Shows content if the user is logged in.
 */
export function WhenLoggedIn({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isSignedIn }) => (
        isSignedIn && children
      )}
    </AuthContext.Consumer>
  );
}

/**
 * Shows content if the user is logged our.
 */
export function WhenLoggedOut({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isSignedIn }) => (
        (isSignedIn === false) && children
      )}
    </AuthContext.Consumer>
  );
}

/**
 * Shows content if the user login status is unknown
 */
export function WhenUnknown({ children }) {
  return (
    <AuthContext.Consumer>
      {({ isSignedIn }) => (
        (isSignedIn === null) && children
      )}
    </AuthContext.Consumer>
  );
}

export default Authenticated;
