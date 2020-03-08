import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express';
import { ApolloLogExtension } from 'apollo-log';

import schema from './graphql'

const dev = process.env.NODE_ENV !== 'production';
const prisma = new PrismaClient({ debug: dev });
const logging = new ApolloLogExtension({
  level: (dev) ? 'debug' : 'info',
});

/**
 * Apollo server middleware
 */
export default new ApolloServer({
  schema,
  context: { prisma },
  debug: dev,
  playground: dev,
  // extensions: [() => logging]
 });
