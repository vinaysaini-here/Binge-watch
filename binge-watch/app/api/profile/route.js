export const runtime = "nodejs";

import { findUserByUsername, updateUser, toPublicUser } from "@/lib/data";
import { fail, ok } from "@/lib/http";
import { requireUser } from "@/lib/session";
import { profileSchema } from "@/lib/validators";

export async function PATCH(request) {
  try {
    const viewer = await requireUser();
    const payload = profileSchema.parse(await request.json());
    const existing = await findUserByUsername(payload.username);

    if (existing && String(existing._id) !== viewer.id) {
      return fail("That username is already in use.", 409);
    }

    const updated = await updateUser(viewer.id, payload);
    return ok({ user: toPublicUser(updated) });
  } catch (error) {
    return fail(error.message || "Unable to update profile.", 400);
  }
}
