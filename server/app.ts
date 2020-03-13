import path from 'path';
import express from 'express';
import next from 'next';

import redirectHandler from './redirectHandler';
import apolloServer from '../backend';

const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({
  dev,
  dir: path.join(__dirname, '../web'),
});
const nextHandler = nextApp.getRequestHandler();

export const app = express();

// Graphql Server
apolloServer.applyMiddleware({
  app,
  path: '/_/graphql',
});

// Attempt to process a redirect
// If it's not the root path and doesn't start with underscore, attempt a redirect
app.all(/^\/[^_]+/, redirectHandler);

// NextJS App
nextApp.prepare().then(() => {
  app.all('*', (req, res) => {
    nextHandler(req, res);
  });
});
