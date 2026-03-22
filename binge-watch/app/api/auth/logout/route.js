export const runtime = "nodejs";

import { clearSession, ok } from "@/lib/http";

export async function POST() {
  const response = ok({ success: true });
  return clearSession(response);
}
