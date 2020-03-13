import url from 'url';
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export default async function redirectHandler(req, res, next) {
  // Remove leading slash from path
  const name = url.parse(req.path).pathname.substr(1).toLowerCase();

  try {
    // Get link
    const link = await prisma.link.findOne({
      where: { name },
    });

    // Redirect
    if (link) {
      try {
        // Add redirect log
        await prisma.redirectLog.create({
          data: {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            userAgent: req.headers['user-agent'],
            // Link
            link: {
              connect: { name },
            },
          },
        });
      } catch(e) {
        console.error(e);
      }

      // Make redirect
      res.writeHead(302, {
        Location: link.url,
      });
      res.end();
      return;
    }
  } catch(e) {
    console.error(e);
  }

  // Go to next route handler if something failed
  next();
}
