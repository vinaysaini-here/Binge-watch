export const runtime = "nodejs";

import { deleteComment } from "@/lib/data";
import { fail, ok } from "@/lib/http";
import { requireUser } from "@/lib/session";

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireUser();
    const deleted = await deleteComment(id, viewer.id);

    if (!deleted) {
      return fail("Comment not found.", 404);
    }

    return ok({ success: true });
  } catch (error) {
    return fail(error.message || "Unable to delete comment.", 400);
  }
}
