export const runtime = "nodejs";

import { incrementViews } from "@/lib/data";
import { ok, fail } from "@/lib/http";

export async function POST(_request, { params }) {
  try {
    const { id } = await params;
    await incrementViews(id);
    return ok({ success: true });
  } catch (error) {
    return fail(error.message || "Unable to record view.", 400);
  }
}
