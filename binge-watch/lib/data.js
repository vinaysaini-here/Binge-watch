import "server-only";
import { ObjectId, getDatabase } from "@/lib/db";
import { normalizeTags } from "@/lib/video-platforms";

let indexesReady = false;

async function ensureIndexes() {
  if (indexesReady) return;

  const db = await getDatabase();

  await Promise.all([
    db.collection("users").createIndex({ email: 1 }, { unique: true }),
    db.collection("users").createIndex({ username: 1 }, { unique: true }),
    db.collection("videos").createIndex({ createdAt: -1 }),
    db.collection("videos").createIndex({ title: "text", description: "text", tags: "text" }),
    db.collection("comments").createIndex({ videoId: 1, createdAt: -1 }),
  ]);

  indexesReady = true;
}

function asObjectId(id) {
  return typeof id === "string" ? new ObjectId(id) : id;
}

export function toPublicUser(user) {
  return {
    id: String(user._id),
    username: user.username,
    email: user.email,
    avatar: user.avatar || "",
    bio: user.bio || "",
    createdAt: user.createdAt,
  };
}

export function toVideoCard(video, viewerId) {
  return {
    id: String(video._id),
    title: video.title,
    description: video.description,
    tags: video.tags || [],
    thumbnail: video.thumbnail,
    sourceUrl: video.sourceUrl,
    platform: video.platform,
    providerLabel: video.providerLabel,
    videoId: video.videoId,
    embedUrl: video.embedUrl,
    viewsCount: video.viewsCount || 0,
    likesCount: video.likesCount || 0,
    commentsCount: video.commentsCount || 0,
    createdAt: video.createdAt,
    author: video.author,
    isLiked: viewerId ? (video.likedBy || []).includes(viewerId) : false,
  };
}

export function toComment(comment, viewerId) {
  return {
    id: String(comment._id),
    body: comment.body,
    createdAt: comment.createdAt,
    author: comment.author,
    canDelete: viewerId ? comment.userId === viewerId : false,
  };
}

export async function createUser(payload) {
  await ensureIndexes();
  const db = await getDatabase();
  const now = new Date();

  const document = {
    ...payload,
    username: payload.username.toLowerCase(),
    bio: payload.bio || "",
    avatar: payload.avatar || "",
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("users").insertOne(document);
  return { ...document, _id: result.insertedId };
}

export async function findUserByEmail(email) {
  await ensureIndexes();
  const db = await getDatabase();
  return db.collection("users").findOne({ email: email.toLowerCase() });
}

export async function findUserByUsername(username) {
  await ensureIndexes();
  const db = await getDatabase();
  return db.collection("users").findOne({ username: username.toLowerCase() });
}

export async function findUserById(id) {
  await ensureIndexes();
  const db = await getDatabase();
  return db.collection("users").findOne({ _id: asObjectId(id) });
}

export async function updateUser(userId, payload) {
  const db = await getDatabase();
  const normalized = {
    ...payload,
    username: payload.username.toLowerCase(),
    updatedAt: new Date(),
  };

  await db.collection("users").updateOne({ _id: asObjectId(userId) }, { $set: normalized });
  return findUserById(userId);
}

export async function createVideo(user, payload) {
  await ensureIndexes();
  const db = await getDatabase();
  const now = new Date();

  const document = {
    title: payload.title,
    description: payload.description,
    tags: normalizeTags(payload.tags),
    thumbnail: payload.thumbnail,
    sourceUrl: payload.sourceUrl,
    platform: payload.platform,
    providerLabel: payload.providerLabel,
    videoId: payload.videoId,
    embedUrl: payload.embedUrl,
    userId: user.id,
    author: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    },
    likedBy: [],
    likesCount: 0,
    viewsCount: 0,
    commentsCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  const result = await db.collection("videos").insertOne(document);
  return toVideoCard({ ...document, _id: result.insertedId }, user.id);
}

export async function listVideos({ page = 1, limit = 8, query = "", platform = "all", sortBy = "latest", userId } = {}, viewerId) {
  await ensureIndexes();
  const db = await getDatabase();
  const filters = {};

  if (platform !== "all") {
    filters.platform = platform;
  }

  if (userId) {
    filters.userId = userId;
  }

  if (query) {
    filters.$or = [
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
    ];
  }

  const sort =
    sortBy === "trending"
      ? { likesCount: -1, viewsCount: -1, commentsCount: -1, createdAt: -1 }
      : { createdAt: -1 };

  const collection = db.collection("videos");
  const [items, total] = await Promise.all([
    collection.find(filters).sort(sort).skip((page - 1) * limit).limit(limit).toArray(),
    collection.countDocuments(filters),
  ]);

  return {
    items: items.map((video) => toVideoCard(video, viewerId)),
    page,
    limit,
    total,
    hasMore: page * limit < total,
  };
}

export async function getVideoById(id, viewerId) {
  await ensureIndexes();
  const db = await getDatabase();
  const video = await db.collection("videos").findOne({ _id: asObjectId(id) });
  if (!video) return null;
  return toVideoCard(video, viewerId);
}

export async function getVideoDocumentById(id) {
  await ensureIndexes();
  const db = await getDatabase();
  return db.collection("videos").findOne({ _id: asObjectId(id) });
}

export async function updateVideo(videoId, userId, payload) {
  const db = await getDatabase();
  await db.collection("videos").updateOne(
    { _id: asObjectId(videoId), userId },
    {
      $set: {
        title: payload.title,
        description: payload.description,
        tags: normalizeTags(payload.tags),
        thumbnail: payload.thumbnail,
        sourceUrl: payload.sourceUrl,
        platform: payload.platform,
        providerLabel: payload.providerLabel,
        videoId: payload.videoId,
        embedUrl: payload.embedUrl,
        updatedAt: new Date(),
      },
    }
  );

  return getVideoById(videoId, userId);
}

export async function deleteVideo(videoId, userId) {
  const db = await getDatabase();
  await Promise.all([
    db.collection("videos").deleteOne({ _id: asObjectId(videoId), userId }),
    db.collection("comments").deleteMany({ videoId }),
  ]);
}

export async function toggleLike(videoId, userId) {
  const db = await getDatabase();
  const video = await getVideoDocumentById(videoId);

  if (!video) return null;

  const liked = (video.likedBy || []).includes(userId);

  await db.collection("videos").updateOne(
    { _id: asObjectId(videoId) },
    liked
      ? { $pull: { likedBy: userId }, $inc: { likesCount: -1 } }
      : { $addToSet: { likedBy: userId }, $inc: { likesCount: 1 } }
  );

  return getVideoById(videoId, userId);
}

export async function incrementViews(videoId) {
  const db = await getDatabase();
  await db.collection("videos").updateOne({ _id: asObjectId(videoId) }, { $inc: { viewsCount: 1 } });
}

export async function listComments(videoId, viewerId) {
  await ensureIndexes();
  const db = await getDatabase();
  const comments = await db.collection("comments").find({ videoId }).sort({ createdAt: -1 }).toArray();
  return comments.map((comment) => toComment(comment, viewerId));
}

export async function addComment(videoId, user, body) {
  const db = await getDatabase();
  const now = new Date();
  const comment = {
    videoId,
    userId: user.id,
    body,
    author: {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
    },
    createdAt: now,
  };

  const result = await db.collection("comments").insertOne(comment);
  await db.collection("videos").updateOne({ _id: asObjectId(videoId) }, { $inc: { commentsCount: 1 } });
  return toComment({ ...comment, _id: result.insertedId }, user.id);
}

export async function deleteComment(commentId, userId) {
  const db = await getDatabase();
  const comment = await db.collection("comments").findOne({ _id: asObjectId(commentId), userId });

  if (!comment) {
    return false;
  }

  await Promise.all([
    db.collection("comments").deleteOne({ _id: comment._id }),
    db.collection("videos").updateOne({ _id: asObjectId(comment.videoId) }, { $inc: { commentsCount: -1 } }),
  ]);

  return true;
}

export async function getProfileByUsername(username, viewerId) {
  const user = await findUserByUsername(username);
  if (!user) return null;

  const videos = await listVideos({ page: 1, limit: 12, userId: String(user._id) }, viewerId);
  return {
    user: toPublicUser(user),
    videos: videos.items,
  };
}
