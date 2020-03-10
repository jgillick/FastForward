import React from 'react';
import App from 'next/app';
import Head from 'next/head';

import Layout from '../components/Layout';
import Authenticated, { WhenLoggedIn, WhenLoggedOut } from '../components/Authenticated';
import LoginBlocker from '../components/LoginBlocker';

export default class MyApp extends App {
  componentDidMount() {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    // Fix loading CSS on route change.
    // https://github.com/zeit/next-plugins/issues/282
    if (module.hot) {
      module.hot.addStatusHandler(status => {
        if (typeof window !== "undefined" && status === "ready") {
          window.__webpack_reload_css__ = true;
        }
      });
    }
  }

  render() {
    const { Component, pageProps } = this.props;

    return (
      <React.Fragment>
        <Head>
          <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </Head>
        <Authenticated>
          <Layout>
            <WhenLoggedIn>
              <Component {...pageProps} />
            </WhenLoggedIn>
            <WhenLoggedOut>
              <LoginBlocker />
            </WhenLoggedOut>
          </Layout>
        </Authenticated>
      </React.Fragment>
    );
  }
}
