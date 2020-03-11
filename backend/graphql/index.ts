import * as path from 'path';
import { nexusPrismaPlugin } from 'nexus-prisma';
import { makeSchema } from 'nexus';

import * as types from './types';
import Queries from './queries';
import Mutations from './mutations';

const schema = makeSchema({
  types: {
    ...types,
    Queries,
    Mutations,
  },
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: path.join(__dirname, '../../node_modules/@types/nexus-typegen/index.d.ts',),
    // typegen: path.join(__dirname, '/index.d.ts',),
  },
});
export default schema;
