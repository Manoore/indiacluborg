import "server-only";
import { cookies } from "next/headers";

const COOKIE_NAME = "heartwalk_admin_session";

export async function isAdminAuthenticated() {
  const store = await cookies();
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;
  return store.get(COOKIE_NAME)?.value === secret;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const expectedEmail = process.env.ADMIN_EMAIL;
  const expectedPassword = process.env.ADMIN_PASSWORD;
  if (!expectedEmail || !expectedPassword) {
    throw new Error("ADMIN_EMAIL / ADMIN_PASSWORD not set in environment");
  }
  return email === expectedEmail && password === expectedPassword;
}

export async function createAdminSession() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET not set in environment");
  const store = await cookies();
  store.set(COOKIE_NAME, secret, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8, // 8 hours
  });
}

export async function clearAdminSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}
