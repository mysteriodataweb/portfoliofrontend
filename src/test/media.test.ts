import { describe, it, expect } from "vitest";
import { parseMedia } from "@/lib/media";

describe("parseMedia", () => {
  it("recognises YouTube links in their common shapes", () => {
    expect(parseMedia("https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10")).toMatchObject({ kind: "youtube", id: "dQw4w9WgXcQ", portrait: false });
    expect(parseMedia("https://youtu.be/dQw4w9WgXcQ?si=abc")).toMatchObject({ kind: "youtube", id: "dQw4w9WgXcQ" });
    expect(parseMedia("https://m.youtube.com/shorts/abc_123-XY")).toMatchObject({ kind: "youtube", id: "abc_123-XY", portrait: true });
  });

  it("turns social and drive links into embeds", () => {
    expect(parseMedia("https://vimeo.com/76979871")).toMatchObject({ kind: "embed", src: "https://player.vimeo.com/video/76979871" });
    expect(parseMedia("https://www.instagram.com/reel/Cxyz_12-a/?igsh=1")).toMatchObject({ kind: "embed", src: "https://www.instagram.com/reel/Cxyz_12-a/embed" });
    expect(parseMedia("https://www.instagram.com/p/Babc/")).toMatchObject({ kind: "embed", src: "https://www.instagram.com/p/Babc/embed" });
    expect(parseMedia("https://www.tiktok.com/@someone/video/7300000000000000000")).toMatchObject({ kind: "embed", src: "https://www.tiktok.com/embed/v2/7300000000000000000" });
    expect(parseMedia("https://drive.google.com/file/d/1AbC-dEf_g/view?usp=sharing")).toMatchObject({ kind: "embed", src: "https://drive.google.com/file/d/1AbC-dEf_g/preview" });
  });

  it("tells image and video files apart", () => {
    expect(parseMedia("https://example.com/photos/match.JPG?size=large")).toMatchObject({ kind: "image" });
    expect(parseMedia("https://images.unsplash.com/photo-123?w=900")).toMatchObject({ kind: "image" });
    expect(parseMedia("https://example.com/clip.mp4")).toMatchObject({ kind: "video" });
  });

  it("keeps unrecognised links and rejects what is not a web link", () => {
    expect(parseMedia("https://photos.app.goo.gl/abc")).toMatchObject({ kind: "unknown", host: "photos.app.goo.gl" });
    expect(parseMedia("pas un lien")).toBeNull();
    expect(parseMedia("javascript:alert(1)")).toBeNull();
  });
});
