/** Client-side fetch helpers for your API routes. */

type ApiResponse<T> = { data?: T; error?: string };

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = (await res.json().catch(() => null)) as ApiResponse<T> | null;
  if (!res.ok) throw new Error(body?.error || res.statusText);
  return body?.data as T;
}
