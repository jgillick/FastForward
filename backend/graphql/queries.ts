import * as schema from 'nexus'
import { authenticate } from '../auth';
import { startOfDay, subDays } from 'date-fns';
import errors from '../errors';

const Queries = schema.queryType({
  definition(t) {
    /**
     * List all links
     */
    t.list.field('links', {
      type: 'Link',
      args: {
        oAuthIdToken: schema.stringArg({ required: true }),
        query: schema.stringArg({ required: false }),
      },
      async resolve(_root, { oAuthIdToken, query }, ctx) {
        // Verify authentication
        await authenticate(oAuthIdToken);

        const where = {};
        if (query){
          where['OR'] = [
            {
              name: {
                contains: query
              }
            },
            {
              url: {
                contains: query
              }
            },
          ];
        }

        return ctx.prisma.link.findMany({
          where,
          orderBy: { name: 'asc' },
        });
      },
    });

    /**
     * Get a single link.
     */
    t.field('link', {
      type: 'Link',
      args: {
        name: schema.stringArg({ required: true }),
      },
      async resolve(_root, { name }, ctx) {
        const link = await ctx.prisma.link.findOne({
          where: { name },
        });

        if (!link) throw new Error(errors.LINK_NOT_FOUND);
        return link;
      },
    });

    /**
     * Get all redirects for a link in the last 30 days.
     */
    t.list.field('redirectLogs', {
      type: 'RedirectLog',
      args: {
        name: schema.stringArg({ required: true }),
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, { name, oAuthIdToken }, ctx) {
        // Verify authentication
        await authenticate(oAuthIdToken);
        const fromDate = startOfDay(subDays(new Date(), 30));
        return ctx.prisma.redirectLog.findMany({
          where: {
            link: { name },
            createdAt: {
              gte: fromDate,
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      },
    });
  },
});

export default Queries;
