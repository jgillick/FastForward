import path from 'path'
import { nexusPrismaPlugin } from 'nexus-prisma'
import { makeSchema } from 'nexus'
import { PrismaClient } from '@prisma/client'
import { ApolloServer } from 'apollo-server-express';
import * as types from './types'

const schema = makeSchema({
  types,
  plugins: [nexusPrismaPlugin()],
  outputs: {
    // typegen: path.join(__dirname, 'nexus-typegen.ts'),
    // schema: path.join(__dirname, 'schema.graphql')
  },
});
export default schema;
