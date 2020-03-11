import { PrismaClient } from '@prisma/client'
import { OAuth2Client } from 'google-auth-library';
import errors from './errors';

const prisma = new PrismaClient();

/**
 * Returns a Google user for the Google OAuth ID token.
 * @param {String} idToken - Google OAuth ID token.
 * @return {Object} Google authenticated user object.
 */
export async function authenticate(idToken) {
  try {
    const oAuth2Client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    const ticket = await oAuth2Client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();

    // Restrict to domain
    if (process.env.AUTH_DOMAINS) {
      const domain = payload.hd?.toLowerCase();
      const domainWhitelist = process.env.AUTH_DOMAINS
        .split(',')
        .filter(d => d.trim().toLowerCase());

      if (!domain || !domainWhitelist.includes(domain)) {
        throw new Error(errors.AUTH_INVALID_DOMAIN);
      }
    }

    return payload;
  } catch(e) {
    throw new Error(errors.INVALID_AUTH);
  }
}

/**
 * Return a user record for the Google OAuth ID Token.
 * @param {String} idToken - Google OAuth ID Token
 * @return {User}
 */
export async function getUser(idToken) {
  const payload = await authenticate(idToken);
  const id = payload.sub;

  return await prisma.user.findOne({
    where: { id },
  });
}

/**
 * Get the user details from google and either update the user
 * record or create a new one.
 * @param {String} idToken - Google OAuth ID Token
 * @return {User}
 */
export async function loginUser(idToken) {
  const payload = await authenticate(idToken);
  const { sub: id, name, picture } = payload;

  // Update existing user
  const existing = await prisma.user.findOne({
    where: { id },
  });
  if (existing) {
    return await prisma.user.update({
      where: { id },
      data: {
        name,
        picture
      },
    });
  }

  // New user
  return await prisma.user.create({
    data: {
      name,
      picture,
      id,
    },
  });
}
