export const runtime = "nodejs";

import { findUserByEmail, toPublicUser } from "@/lib/data";
import { signToken, verifyPassword } from "@/lib/auth";
import { attachSession, ok, fail } from "@/lib/http";
import { loginSchema } from "@/lib/validators";

export async function POST(request) {
  try {
    const payload = loginSchema.parse(await request.json());
    const user = await findUserByEmail(payload.email);

    if (!user) {
      return fail("Invalid email or password.", 401);
    }

    const valid = await verifyPassword(payload.password, user.passwordHash);
    if (!valid) {
      return fail("Invalid email or password.", 401);
    }

    const token = await signToken({ userId: String(user._id) });
    const response = ok({ user: toPublicUser(user) });
    return attachSession(response, token);
  } catch (error) {
    return fail(error.message || "Unable to log in.", 400);
  }
}
