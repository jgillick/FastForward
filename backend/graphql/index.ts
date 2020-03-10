import path from 'path';
import { nexusPrismaPlugin } from 'nexus-prisma';
import { makeSchema } from 'nexus';

import * as types from './types'

const schema = makeSchema({
  types,
  plugins: [nexusPrismaPlugin()],
  outputs: {
    typegen: path.join(__dirname, '../../node_modules/@types/nexus-typegen/index.d.ts',),
  },
});
export default schema;
