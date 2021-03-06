import React from 'react';
import App from 'next/app';
import Head from 'next/head';
import { withApollo } from '../apollo/client'

import Layout from '../components/Layout';
import Authenticated from '../components/Authenticated';

class MyApp extends App {
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
          window['__webpack_reload_css__'] = true;
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
            <Component {...pageProps} />
          </Layout>
        </Authenticated>
      </React.Fragment>
    );
  }
}
const MyAppApollo = withApollo(MyApp);
export default MyAppApollo;
