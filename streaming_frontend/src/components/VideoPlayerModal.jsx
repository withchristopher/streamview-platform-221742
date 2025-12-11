import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect } from "react";

// PUBLIC_INTERFACE
export default function VideoPlayerModal({ open, onClose, video }) {
  /**
   * Simple modal overlay that renders video element or external src.
   */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const title = video?.title || "Now Playing";
  // Prefer video.stream_url or video.url
  const src = video?.stream_url || video?.url || "";

  return (
    <div
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-5xl bg-white rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold text-lg">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="p-1 rounded hover:bg-gray-100"
          >
            <XMarkIcon className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        <div className="relative aspect-video bg-black">
          {src ? (
            <video controls className="w-full h-full">
              <source src={src} />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full h-full grid place-items-center text-white/80">
              No stream URL
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
