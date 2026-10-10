import { useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import type { Media } from "@/lib/media";

const frame = "overflow-hidden rounded-[1.25rem] bg-secondary";

const ActivityMedia = ({
  media,
  title,
  onOpenImage,
}: {
  media: Media;
  title: string;
  onOpenImage: (src: string) => void;
}) => {
  const [playing, setPlaying] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  if (media.kind === "image" || (media.kind === "unknown" && !imageFailed)) {
    const src = media.kind === "image" ? media.src : media.href;
    return (
      <button
        type="button"
        onClick={() => onOpenImage(src)}
        aria-label={`Agrandir la photo : ${title}`}
        className={`${frame} block w-full cursor-zoom-in`}
      >
        <img
          src={src}
          alt={title}
          loading="lazy"
          onError={() => setImageFailed(true)}
          className="h-auto w-full"
        />
      </button>
    );
  }

  if (media.kind === "unknown") {
    return (
      <a
        href={media.href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex aspect-[4/3] flex-col justify-between rounded-[1.25rem] bg-foreground p-6 text-background transition-colors hover:bg-foreground/90"
      >
        <span className="text-sm opacity-70">{media.host}</span>
        <span className="inline-flex items-center gap-2 font-heading text-2xl font-bold leading-tight">
          Voir la publication <ArrowUpRight className="h-6 w-6 shrink-0" />
        </span>
      </a>
    );
  }

  if (media.kind === "video") {
    return (
      <div className={frame}>
        <video src={media.src} controls preload="metadata" playsInline className="h-auto w-full" />
      </div>
    );
  }

  const ratio = media.portrait ? "aspect-[9/16]" : "aspect-video";

  // YouTube only loads its player once the visitor asks for it.
  if (media.kind === "youtube" && !playing) {
    return (
      <button
        type="button"
        onClick={() => setPlaying(true)}
        aria-label={`Lire la vidéo : ${title}`}
        className={`${frame} ${ratio} group relative block w-full`}
      >
        <img src={media.poster} alt="" loading="lazy" className="h-full w-full object-cover" />
        <span className="absolute inset-0 flex items-center justify-center bg-foreground/20 transition-colors group-hover:bg-foreground/35">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-background text-foreground">
            <Play className="ml-1 h-6 w-6 fill-current" />
          </span>
        </span>
      </button>
    );
  }

  const src =
    media.kind === "youtube" ? `https://www.youtube-nocookie.com/embed/${media.id}?autoplay=1` : media.src;

  return (
    <div className={`${frame} ${ratio}`}>
      <iframe
        src={src}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
};

export default ActivityMedia;
