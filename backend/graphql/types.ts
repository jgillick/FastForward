import * as schema from 'nexus'
import { authenticate, getUser, loginUser } from './auth';
import { startOfDay, subDays } from 'date-fns';
import { LINK_NOT_FOUND, LINK_EXISTS, AUTH_NO_USER, LINK_EDITING_DISABLED } from './errors';

export const Link = schema.objectType({
  name: 'Link',
  definition(t) {
    t.model.name();
    t.model.url();
    t.model.history();
    t.model.redirects();
    t.model.createdAt();
    t.model.updatedAt();

    t.field('currentRevision', {
      type: 'Revision',
      async resolve(parent, _args, ctx) {
        const currentRev = await ctx.prisma.revision.findMany({
          where: {
            link: { name: parent.name },
          },
          orderBy: {
            createdAt: 'asc',
          },
          first: 1,
        });
        return currentRev[0];
      },
    });

    t.field('user', {
      type: 'User',
      async resolve(parent, _args, ctx) {
        const currentRev = await ctx.prisma.revision.findMany({
          where: {
            link: { name: parent.name },
          },
          orderBy: {
            createdAt: 'asc',
          },
          include: { user: true }
        });
        return currentRev[0].user;
      },
    });
  },
});

export const Revision = schema.objectType({
  name: 'Revision',
  definition(t) {
    t.model.id();
    t.model.url();
    t.model.link();
    t.model.user();
    t.model.createdAt();
  },
});

export const User = schema.objectType({
  name: 'User',
  definition(t) {
    t.model.id()
    t.model.name()
    t.model.picture()
  },
});

export const RedirectLog = schema.objectType({
  name: 'RedirectLog',
  definition(t) {
    t.model.id()
    t.model.link()
    t.model.ip()
    t.model.userAgent()
    t.model.createdAt()
  },
});


export const Queries = schema.queryType({
  definition(t) {
    /**
     * List all links
     */
    t.list.field('links', {
      type: 'Link',
      args: {
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, { oAuthIdToken }, ctx) {
        // Verify authentication
        await authenticate(oAuthIdToken);
        return ctx.prisma.link.findMany({
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

        if (!link) throw new Error(LINK_NOT_FOUND);
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

export const Mutations = schema.mutationType({
  definition(t){

    /**
     * Login user
     */
    t.field('login', {
      type: 'User',
      args: {
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, { oAuthIdToken }, ctx) {
        return await loginUser(oAuthIdToken);
      }
    });

    /**
     * Create a new link
     */
    t.field('createLink', {
      type: "Link",
      args: {
        url: schema.stringArg({ required: true }),
        name: schema.stringArg({ required: true }),
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, { name, url, oAuthIdToken }, ctx) {
        const user = await getUser(oAuthIdToken);
        if (!user) {
          throw new Error(AUTH_NO_USER);
        }

        // Check if it already exists
        const exists = await ctx.prisma.link.findOne({
          where: { name }
        });
        if (exists) {
          throw new Error(LINK_EXISTS);
        }

        return await ctx.prisma.link.create({
          data: {
            url: url,
            name: name.trim().toLowerCase(),
            // Revision
            history: {
              create: [
                {
                  url,
                  // User
                  user: {
                    connect: {
                      id: user.id,
                    },
                  },
                },
              ],
            },
          },
        });
      }
    });

    /**
     * Associate a new URL with an existing link.
     */
    t.field('updateLink', {
      type: 'Link',
      args: {
        name: schema.stringArg({ required: true }),
        url: schema.stringArg({ required: true }),
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, { name, url, oAuthIdToken }, ctx) {
        // Ensure editing is enabled
        if (process.env.LINK_EDITING !== 'enabled') {
          throw new Error(LINK_EDITING_DISABLED);
        }

        // Get autheticated user
        const user = await getUser(oAuthIdToken);
        if (!user) {
          throw new Error(AUTH_NO_USER);
        }

        // Find link
        const link = await ctx.prisma.link.findOne({
          where: { name: name.trim().toLowerCase() },
        });
        if (!link) throw new Error(LINK_NOT_FOUND);

        // Create revision
        await ctx.prisma.revision.create({
          data: {
            url: url,
            link: {
              connect: {
                name: link.name,
              },
            },
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          include: { link: true },
        });

        // Update link record
        const updated = await ctx.prisma.link.update({
          where: { name: link.name },
          data: { url }
        });
        return updated;
      }
    });
  }
})
