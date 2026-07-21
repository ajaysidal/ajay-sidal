let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getOpenProviderToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiry) return cachedToken;

  const username = process.env.OPENPROVIDER_USERNAME;
  const password = process.env.OPENPROVIDER_PASSWORD;
  if (!username || !password) throw new Error('Missing OpenProvider credentials');

  const res = await fetch('https://api.openprovider.eu/v1beta/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password, ip: '0.0.0.0' }),
  });

  if (!res.ok) throw new Error('OpenProvider Auth Failed');
  const data = await res.json();
  cachedToken = data.data.token;
  tokenExpiry = Date.now() + (47 * 60 * 60 * 1000); // 47 hours
  return cachedToken!; // Non-null assertion: we just set it above
}

export async function fetchWithAuth(url: string, options?: RequestInit) {
  const token = await getOpenProviderToken();
  return fetch(url, { ...options, headers: { ...options?.headers, Authorization: `Bearer ${token}` } });
}
