export const runtime = "nodejs";

import { createUser, findUserByEmail, findUserByUsername, toPublicUser } from "@/lib/data";
import { hashPassword, signToken } from "@/lib/auth";
import { attachSession, created, fail } from "@/lib/http";
import { registerSchema } from "@/lib/validators";

export async function POST(request) {
  try {
    const payload = registerSchema.parse(await request.json());

    const [existingEmail, existingUsername] = await Promise.all([
      findUserByEmail(payload.email),
      findUserByUsername(payload.username),
    ]);

    if (existingEmail) {
      return fail("An account with this email already exists.", 409);
    }

    if (existingUsername) {
      return fail("This username is already taken.", 409);
    }

    const passwordHash = await hashPassword(payload.password);
    const user = await createUser({
      email: payload.email.toLowerCase(),
      username: payload.username,
      passwordHash,
      bio: "",
      avatar: "",
    });

    const token = await signToken({ userId: String(user._id) });
    const response = created({ user: toPublicUser(user) });
    return attachSession(response, token);
  } catch (error) {
    return fail(error.message || "Unable to create account.", 400);
  }
}
