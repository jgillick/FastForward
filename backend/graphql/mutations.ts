import * as schema from 'nexus'
import { getUser, loginUser } from '../auth';
import errors from '../errors';

const Mutations = schema.mutationType({
  definition(t){

    /**
     * Login user
     */
    t.field('login', {
      type: 'User',
      args: {
        oAuthIdToken: schema.stringArg({ required: true }),
      },
      async resolve(_root, args, ctx) {
        return await loginUser(args.oAuthIdToken);
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
          throw new Error(errors.AUTH_NO_USER);
        }

        // Check if it already exists
        const exists = await ctx.prisma.link.findOne({
          where: { name }
        });
        if (exists) {
          throw new Error(errors.LINK_EXISTS);
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
          throw new Error(errors.LINK_EDITING_DISABLED);
        }

        // Get autheticated user
        const user = await getUser(oAuthIdToken);
        if (!user) {
          throw new Error(errors.AUTH_NO_USER);
        }

        // Find link
        const link = await ctx.prisma.link.findOne({
          where: { name: name.trim().toLowerCase() },
        });
        if (!link) throw new Error(errors.LINK_NOT_FOUND);

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
});

export default Mutations;
