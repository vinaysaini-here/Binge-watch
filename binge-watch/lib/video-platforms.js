const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

const VIMEO_HOSTS = new Set([
  "vimeo.com",
  "www.vimeo.com",
  "player.vimeo.com",
]);

function parseYouTubeId(url) {
  if (url.hostname.includes("youtu.be")) {
    return url.pathname.split("/").filter(Boolean)[0];
  }

  if (url.pathname.startsWith("/watch")) {
    return url.searchParams.get("v");
  }

  const parts = url.pathname.split("/").filter(Boolean);
  const marker = parts.find((part) => ["embed", "shorts", "live"].includes(part));
  if (!marker) {
    return null;
  }

  const markerIndex = parts.indexOf(marker);
  return parts[markerIndex + 1] || null;
}

function parseVimeoId(url) {
  const parts = url.pathname.split("/").filter(Boolean);
  const numeric = parts.find((part) => /^\d+$/.test(part));
  return numeric || null;
}

export function extractVideoMetadata(rawUrl) {
  let parsed;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error("Enter a valid video URL.");
  }

  const hostname = parsed.hostname.toLowerCase();

  if (YOUTUBE_HOSTS.has(hostname)) {
    const videoId = parseYouTubeId(parsed);

    if (!videoId || videoId.length < 6) {
      throw new Error("Unable to extract a valid YouTube video ID.");
    }

    return {
      platform: "youtube",
      videoId,
      sourceUrl: parsed.toString(),
      embedUrl: `https://www.youtube.com/embed/${videoId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&playsinline=1&iv_load_policy=3`,
      thumbnail: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      providerLabel: "YouTube",
    };
  }

  if (VIMEO_HOSTS.has(hostname)) {
    const videoId = parseVimeoId(parsed);

    if (!videoId) {
      throw new Error("Unable to extract a valid Vimeo video ID.");
    }

    return {
      platform: "vimeo",
      videoId,
      sourceUrl: parsed.toString(),
      embedUrl: `https://player.vimeo.com/video/${videoId}?controls=0&title=0&byline=0&portrait=0&dnt=1`,
      thumbnail: `https://vumbnail.com/${videoId}.jpg`,
      providerLabel: "Vimeo",
    };
  }

  throw new Error("Only YouTube and Vimeo URLs are supported right now.");
}

export function normalizeTags(tags = []) {
  return [...new Set(tags.map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
}
