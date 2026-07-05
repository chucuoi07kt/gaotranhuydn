import 'server-only';

import { cookies } from 'next/headers';

const ADMIN_COOKIE = 'gth-admin';
const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

export async function getAdminPassword(): Promise<string> {
  return process.env.ADMIN_PASSWORD || 'admin123';
}

export async function verifyAdminLogin(password: string): Promise<boolean> {
  const adminPassword = await getAdminPassword();
  return password === adminPassword;
}

export async function setAdminSession(): Promise<void> {
  const store = await cookies();
  const token = Buffer.from(
    `${Date.now()}:${process.env.ADMIN_PASSWORD || 'admin123'}`
  ).toString('base64');
  store.set(ADMIN_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearAdminSession(): Promise<void> {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  try {
    const decoded = Buffer.from(token, 'base64').toString('utf-8');
    const [ts, pwd] = decoded.split(':');
    if (!ts || !pwd) return false;
    const adminPassword = await getAdminPassword();
    if (pwd !== adminPassword) return false;
    const issuedAt = parseInt(ts, 10);
    if (!Number.isFinite(issuedAt)) return false;
    if (Date.now() - issuedAt > SESSION_MAX_AGE * 1000) return false;
    return true;
  } catch {
    return false;
  }
}
