import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verifyToken } from "@/lib/auth";
import { findUserById, toPublicUser } from "@/lib/data";

export const SESSION_COOKIE = "binge_watch_session";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  const payload = await verifyToken(token);

  if (!payload?.userId) {
    return null;
  }

  const user = await findUserById(payload.userId);
  return user ? toPublicUser(user) : null;
});

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}
