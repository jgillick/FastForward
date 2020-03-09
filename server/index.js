import path from 'path';
import express from 'express';
import next from 'next';

import redirectHandler from './redirectHandler';
import apolloServer from '../backend';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({
  dev,
  dir: path.join(__dirname, '../frontend'),
});
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();

  // Graphql Server
  apolloServer.applyMiddleware({
    app,
    path: '/_/graphql',
  });

  // Attempt to process a redirect
  // If it's not the root path and doesn't start with underscore, attempt a redirect
  app.all(/^\/[^_]+/, redirectHandler);

  // Pass all other requests to Next.js
  app.all('*', (req, res) => {
    nextHandler(req, res);
  });

  // Start server
  app.listen(port, err => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`)
  })
})
