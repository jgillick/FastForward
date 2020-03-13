import { app } from './app';

const host = process.env.HOST || '0.0.0.0';
const port = Number(process.env.PORT) || 3000;

// Start server
app.listen(port, host, (err) => {
  if (err) throw err
  console.log(`> Ready on http://${host}:${port}`)
});
