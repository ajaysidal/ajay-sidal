/**
 * OpenFort + Alchemy session shim - replace with real implementation
 */

export type VerifiedUser = {
  id: string;
  email?: string;
  name?: string;
  tier?: string;
};

export async function verifySession(_cookies?: any): Promise<VerifiedUser | null> {
  return null; // Stub - replace with real OpenFort session check
}

export function getCurrentUserId(_cookies?: any): string | null {
  return null; // Stub
}

export async function verifySessionOrThrow(cookies?: any): Promise<VerifiedUser> {
  const user = await verifySession(cookies);
  if (!user) throw new Error('Unauthenticated');
  return user;
}
