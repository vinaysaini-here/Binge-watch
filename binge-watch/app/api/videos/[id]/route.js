export const runtime = "nodejs";

import { deleteVideo, getVideoById, updateVideo } from "@/lib/data";
import { fail, ok } from "@/lib/http";
import { getCurrentUser, requireUser } from "@/lib/session";
import { validateVideoPayload } from "@/lib/validators";

export async function GET(_request, { params }) {
  const { id } = await params;
  const viewer = await getCurrentUser();
  const video = await getVideoById(id, viewer?.id);

  if (!video) {
    return fail("Video not found.", 404);
  }

  return ok({ video });
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireUser();
    const payload = validateVideoPayload(await request.json());
    const updated = await updateVideo(id, viewer.id, payload);

    if (!updated) {
      return fail("Video not found.", 404);
    }

    return ok({ video: updated });
  } catch (error) {
    return fail(error.message || "Unable to update video.", 400);
  }
}

export async function DELETE(_request, { params }) {
  try {
    const { id } = await params;
    const viewer = await requireUser();
    await deleteVideo(id, viewer.id);
    return ok({ success: true });
  } catch (error) {
    return fail(error.message || "Unable to delete video.", 400);
  }
}
