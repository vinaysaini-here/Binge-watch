import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";

const secret = process.env.JWT_SECRET || "development-only-secret";
const key = new TextEncoder().encode(secret);

export async function hashPassword(password) {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

export async function verifyToken(token) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, key);
    return payload;
  } catch {
    return null;
  }
}
