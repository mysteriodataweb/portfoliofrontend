export type Media =
  | { kind: "image"; src: string }
  | { kind: "video"; src: string }
  | { kind: "youtube"; id: string; poster: string; portrait: boolean }
  | { kind: "embed"; src: string; provider: string; portrait: boolean }
  // A link we cannot classify: tried as an image first, shown as a plain link if that fails.
  | { kind: "unknown"; href: string; host: string };

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;

export const mediaLabels: Record<Media["kind"], string> = {
  image: "Photo",
  video: "Vidéo",
  youtube: "Vidéo YouTube",
  embed: "Publication intégrée",
  unknown: "Lien",
};

/** Works out how to display a pasted link: photo, video file, or an embeddable post. */
export function parseMedia(raw: string): Media | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }
  if (!["http:", "https:"].includes(url.protocol)) return null;

  const host = url.hostname.replace(/^(www|m)\./, "");
  const path = url.pathname;

  if (host === "youtu.be" || host.endsWith("youtube.com")) {
    const id =
      host === "youtu.be"
        ? path.split("/")[1]
        : url.searchParams.get("v") || path.match(/^\/(?:shorts|embed|live)\/([\w-]+)/)?.[1];
    if (id) {
      return {
        kind: "youtube",
        id,
        poster: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
        portrait: path.startsWith("/shorts/"),
      };
    }
  }

  const vimeo = host.endsWith("vimeo.com") && path.match(/\/(\d+)/)?.[1];
  if (vimeo) {
    return { kind: "embed", provider: "Vimeo", src: `https://player.vimeo.com/video/${vimeo}`, portrait: false };
  }

  const instagram = host === "instagram.com" && path.match(/^\/(p|reels?|tv)\/([\w-]+)/);
  if (instagram) {
    const type = instagram[1] === "p" ? "p" : instagram[1] === "tv" ? "tv" : "reel";
    return {
      kind: "embed",
      provider: "Instagram",
      src: `https://www.instagram.com/${type}/${instagram[2]}/embed`,
      portrait: true,
    };
  }

  const tiktok = host.endsWith("tiktok.com") && path.match(/\/video\/(\d+)/)?.[1];
  if (tiktok) {
    return { kind: "embed", provider: "TikTok", src: `https://www.tiktok.com/embed/v2/${tiktok}`, portrait: true };
  }

  if (host === "drive.google.com") {
    const id = path.match(/\/file\/d\/([\w-]+)/)?.[1] || url.searchParams.get("id");
    if (id) {
      return {
        kind: "embed",
        provider: "Google Drive",
        src: `https://drive.google.com/file/d/${id}/preview`,
        portrait: false,
      };
    }
  }

  if (VIDEO_EXT.test(path)) return { kind: "video", src: url.href };
  if (IMAGE_EXT.test(path) || host === "images.unsplash.com" || host === "i.pinimg.com") {
    return { kind: "image", src: url.href };
  }

  return { kind: "unknown", href: url.href, host };
}

/** A still picture for previews, when the link has one. */
export function mediaStill(media: Media | null): string | null {
  if (!media) return null;
  if (media.kind === "image") return media.src;
  // The 16:9 thumbnail: the larger one has black bars baked in, which show once cropped to a tile.
  if (media.kind === "youtube") return `https://img.youtube.com/vi/${media.id}/mqdefault.jpg`;
  return null;
}
