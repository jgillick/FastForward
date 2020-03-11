import * as schema from 'nexus'

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
