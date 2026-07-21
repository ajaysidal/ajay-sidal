import { cookies } from 'next/headers';
import { normalizeUserTier, type UserTier } from '../utils/membership';
import { getUser } from './userStore';
import { USER_ID_COOKIE } from '../utils/membership';

/**
 * Openfort has been removed.
 * This now returns ONLY cookie-based user IDs.
 */
export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(USER_ID_COOKIE)?.value || null;
}

/**
 * Get the current user's tier
 * Falls back to cookie-based user ID
 */
export async function getCurrentUserTier(): Promise<UserTier> {
  const userId = await getSessionUserId();
  if (!userId) return 'AI_EXPLORER';

  const user = await getUser(userId).catch(() => null);
  return normalizeUserTier(user?.subscription_tier);
}
