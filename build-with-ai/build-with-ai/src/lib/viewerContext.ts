import { cookies } from 'next/headers';
import { prisma } from './prisma';
import { getUser } from './userStore';
import { USER_ID_COOKIE } from '../utils/membership';

const MASTER_ADMIN_EMAILS = new Set(
  [
    'asidal@outlook.com',
    ...((process.env.MASTER_ADMIN_EMAILS || '')
      .split(',')
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)),
  ],
);

const MASTER_ADMIN_USER_IDS = new Set(
  ((process.env.MASTER_ADMIN_USER_IDS || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)),
);

export type ViewerContext = {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
  isAuthenticated: boolean;
  isMasterAdmin: boolean;
};

function matchesFounderName(name: string | null | undefined) {
  const normalized = (name || '').trim().toLowerCase();
  if (!normalized) return false;
  return normalized.includes('ajay') || normalized.includes('silas');
}

/**
 * Openfort has been removed.
 * This function now relies ONLY on:
 * - Cookie-based userId
 * - Database lookups
 * - Admin secret cookie
 */
export async function getViewerContext(): Promise<ViewerContext> {
  const cookieStore = await cookies();

  // Primary user identity comes from cookie
  const cookieUserId = (await cookieStore).get(USER_ID_COOKIE)?.value || null;
  const userId = cookieUserId;

  // Admin secret override
  const adminSecret = (process.env.ADMIN_SECRET || '').trim();
  const adminCookie = (await cookieStore).get('admin_secret')?.value || '';
  const adminSecretAuthenticated = Boolean(adminSecret && adminCookie === adminSecret);

  // Email + name resolution (database only now)
  let email: string | null = null;
  let name: string | null = null;
  let role: string | null = null;

  if (userId) {
    // Try userStore first
    const dbProfile = await getUser(userId).catch(() => null);
    if (dbProfile) {
      email = (dbProfile.email || '').trim().toLowerCase() || null;
    }

    // If email exists, try Prisma user lookup
    if (email) {
      const prismaUser = await prisma.user.findUnique({
        where: { email },
        select: { role: true, name: true, email: true },
      }).catch(() => null);

      if (prismaUser) {
        role = prismaUser.role || role;
        name = prismaUser.name || name;
        email = prismaUser.email?.toLowerCase() || email;
      }
    }
  }

  return buildViewerContext({
    userId,
    email,
    name,
    role: adminSecretAuthenticated ? 'admin' : role,
  });
}

function buildViewerContext(args: {
  userId: string | null;
  email: string | null;
  name: string | null;
  role: string | null;
}): ViewerContext {
  const normalizedRole = args.role?.trim().toLowerCase() || null;

  const isMasterAdmin = Boolean(
    normalizedRole === 'admin' ||
    (args.email && MASTER_ADMIN_EMAILS.has(args.email)) ||
    (args.userId && MASTER_ADMIN_USER_IDS.has(args.userId)) ||
    matchesFounderName(args.name)
  );

  return {
    userId: args.userId,
    email: args.email,
    name: args.name,
    role: normalizedRole,
    isAuthenticated: Boolean(args.userId || args.email),
    isMasterAdmin,
  };
}

export async function requireMasterAdmin() {
  const viewer = await getViewerContext();
  if (!viewer.isMasterAdmin) {
    throw new Error('Unauthorized');
  }
  return viewer;
}
