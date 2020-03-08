const path = require("path");
const dotenv = require("dotenv");
const dotenvWebpack = require("dotenv-webpack");
const withSass = require('@zeit/next-sass')

dotenv.config();

module.exports = withSass({
  env: [
    'GRAPHQL_URL',
    'GOOGLE_CLIENT_ID',
    'GOOGLE_API_KEY',
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
        path: path.join(__dirname, ".env"),
        systemvars: true,
      })
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
