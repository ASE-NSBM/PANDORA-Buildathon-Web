import { cookies } from "next/headers";
import { createHash, randomBytes } from "crypto";
import connectDB from "@/lib/mongodb";
import AdminSession from "@/models/AdminSession";

export const SESSION_COOKIE = "admin_session";
export const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

interface AdminDoc {
  _id: unknown;
  username: string;
}

/**
 * Creates a new DB-backed session for the given admin and sets the cookie.
 * Only the SHA-256 hash of the token is stored; the raw token lives in the
 * httpOnly cookie so a DB leak can't be replayed as a valid session.
 */
export async function createSession(admin: AdminDoc): Promise<void> {
  await connectDB();

  const raw = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  await AdminSession.create({
    tokenHash: hashToken(raw),
    adminId: admin._id,
    username: admin.username,
    expiresAt,
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, raw, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: Math.floor(SESSION_DURATION_MS / 1000),
  });
}

export interface AdminSessionInfo {
  username: string;
  adminId: string;
}

/**
 * Returns the current valid admin session, or null. Safe to call from server
 * components and route handlers (Node runtime).
 */
export async function getAdminSession(): Promise<AdminSessionInfo | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;

  await connectDB();

  const session = await AdminSession.findOne({
    tokenHash: hashToken(raw),
    expiresAt: { $gt: new Date() },
  }).lean<{ username: string; adminId: unknown } | null>();

  if (!session) return null;

  return { username: session.username, adminId: String(session.adminId) };
}

/** Deletes the current session from the DB and clears the cookie. */
export async function destroySession(): Promise<void> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;

  if (raw) {
    await connectDB();
    await AdminSession.deleteOne({ tokenHash: hashToken(raw) });
  }

  cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
}
