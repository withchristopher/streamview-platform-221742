import { PlayIcon } from "@heroicons/react/24/solid";

// PUBLIC_INTERFACE
export default function VideoCard({ video, onClick }) {
  /**
   * Displays a video thumbnail with title; triggers onClick to open player.
   */
  const title = video?.title || "Untitled";
  const thumbnail =
    video?.thumbnail ||
    `https://picsum.photos/seed/${encodeURIComponent(title)}/600/340`;

  return (
    <button
      onClick={() => onClick && onClick(video)}
      className="group w-full text-left"
      aria-label={`Play ${title}`}
    >
      <div className="relative aspect-video overflow-hidden rounded-lg bg-surface card">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-white">
          <div className="w-8 h-8 rounded-full bg-primary grid place-items-center shadow">
            <PlayIcon className="w-4 h-4" />
          </div>
          <span className="font-medium drop-shadow">{title}</span>
        </div>
      </div>
    </button>
  );
}
