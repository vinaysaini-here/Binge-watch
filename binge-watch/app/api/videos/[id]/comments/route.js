export const runtime = "nodejs";

import { addComment, listComments } from "@/lib/data";
import { created, fail, ok } from "@/lib/http";
import { getCurrentUser, requireUser } from "@/lib/session";
import { commentSchema } from "@/lib/validators";

export async function GET(_request, { params }) {
  try {
    const { id } = await params;
    const viewer = await getCurrentUser();
    const comments = await listComments(id, viewer?.id);
    return ok({ comments });
  } catch (error) {
    return fail(error.message || "Unable to fetch comments.", 400);
  }
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireUser();
    const payload = commentSchema.parse(await request.json());
    const comment = await addComment(id, viewer, payload.body);
    return created({ comment });
  } catch (error) {
    return fail(error.message || "Unable to post comment.", 400);
  }
}
