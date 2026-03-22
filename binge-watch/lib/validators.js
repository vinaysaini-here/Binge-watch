import { z } from "zod";
import { extractVideoMetadata, normalizeTags } from "@/lib/video-platforms";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters.")
    .max(20, "Username must be 20 characters or fewer.")
    .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, and underscores only."),
  email: z.string().email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .regex(/[A-Z]/, "Password must include an uppercase letter.")
    .regex(/[a-z]/, "Password must include a lowercase letter.")
    .regex(/[0-9]/, "Password must include a number."),
});

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const profileSchema = z.object({
  username: registerSchema.shape.username,
  bio: z.string().max(180, "Bio must be 180 characters or fewer.").optional().default(""),
  avatar: z.string().url("Avatar must be a valid URL.").optional().or(z.literal("")),
});

export const commentSchema = z.object({
  body: z
    .string()
    .trim()
    .min(2, "Comment must be at least 2 characters.")
    .max(500, "Comment must be 500 characters or fewer."),
});

export const videoSchema = z.object({
  url: z.string().url("Enter a valid video URL."),
  title: z.string().trim().min(3, "Title must be at least 3 characters.").max(120),
  description: z.string().trim().min(10, "Description must be at least 10 characters.").max(2000),
  tags: z.union([z.string(), z.array(z.string())]).optional().transform((value) => {
    if (Array.isArray(value)) return normalizeTags(value);
    return normalizeTags(String(value || "").split(","));
  }),
  thumbnail: z.string().url("Thumbnail must be a valid URL.").optional().or(z.literal("")),
});

export function validateVideoPayload(payload) {
  const parsed = videoSchema.parse(payload);
  const external = extractVideoMetadata(parsed.url);

  return {
    ...parsed,
    ...external,
    thumbnail: parsed.thumbnail || external.thumbnail,
  };
}

export function validateVideoQuery(params) {
  const schema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(24).default(8),
    query: z.string().optional().default(""),
    platform: z.enum(["all", "youtube", "vimeo"]).default("all"),
    sortBy: z.enum(["latest", "trending"]).default("latest"),
    userId: z.string().optional(),
  });

  return schema.parse(params);
}
