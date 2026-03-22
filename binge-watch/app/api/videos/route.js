export const runtime = "nodejs";

import { createVideo, listVideos } from "@/lib/data";
import { created, fail, ok } from "@/lib/http";
import { getCurrentUser, requireUser } from "@/lib/session";
import { validateVideoPayload, validateVideoQuery } from "@/lib/validators";

export async function GET(request) {
  try {
    const viewer = await getCurrentUser();
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = validateVideoQuery(params);
    const result = await listVideos(query, viewer?.id);
    return ok(result);
  } catch (error) {
    return fail(error.message || "Unable to fetch videos.", 400);
  }
}

export async function POST(request) {
  try {
    const viewer = await requireUser();
    const payload = validateVideoPayload(await request.json());
    const video = await createVideo(viewer, payload);
    return created({ video });
  } catch (error) {
    return fail(error.message || "Unable to submit video.", 400);
  }
}
