import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express';

import schema from './graphql'

const dev = process.env.NODE_ENV !== 'production';
const prisma = new PrismaClient();

/**
 * Apollo server middleware
 */
export default new ApolloServer({
  schema,
  context: { prisma },
  debug: dev,
  playground: dev,
 });
