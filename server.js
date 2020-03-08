import path from 'path';
import express from 'express';
import next from 'next';
// import cors from 'cors';

import apolloServer from './backend';

const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV !== 'production';

const nextApp = next({
  dev,
  dir: path.join(__dirname, 'frontend'),
});
const nextHandler = nextApp.getRequestHandler();

nextApp.prepare().then(() => {
  const app = express();
  // app.use(cors());

  // Graphql Server
  apolloServer.applyMiddleware({
    app,
    path: '/_/graphql',
  });

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
