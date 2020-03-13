const path = require("path");
const dotenv = require("dotenv");
const dotenvWebpack = require("dotenv-webpack");
const withSass = require('@zeit/next-sass')

const envFile = path.join(__dirname, '../.env');
dotenv.config({ path: envFile });

module.exports = withSass({
  target: 'serverless',
  env: [
    'GRAPHQL_URL',
    'GOOGLE_CLIENT_ID',
    'LINK_EDITING',
    'HOST',
    'PORT',
  ],

  cssModules: true,
  cssLoaderOptions: {
    sourceMap: (process.env.NODE_ENV !== "production"),
    localIdentName: "[local]_[hash:base64:5]",
  },

  webpack: config => {
    config.plugins = config.plugins || [];
    config.plugins = [
      ...config.plugins,

      // Read the .env file
      new dotenvWebpack({
        path: envFile,
        systemvars: true,
      }),
    ];

    return config;
  },

  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
});
