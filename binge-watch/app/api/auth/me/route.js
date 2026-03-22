export const runtime = "nodejs";

import { getCurrentUser } from "@/lib/session";
import { ok } from "@/lib/http";

export async function GET() {
  const user = await getCurrentUser();
  return ok({ user });
}
