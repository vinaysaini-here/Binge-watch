export const runtime = "nodejs";

import { toggleLike } from "@/lib/data";
import { fail, ok } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function POST(_request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireUser();
    const video = await toggleLike(id, viewer.id);

    if (!video) {
      return fail("Video not found.", 404);
    }

    return ok({ video });
  } catch (error) {
    return fail(error.message || "Unable to toggle like.", 400);
  }
}
