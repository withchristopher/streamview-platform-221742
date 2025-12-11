import { XMarkIcon } from "@heroicons/react/24/outline";
import { useEffect, useMemo, useState } from "react";
import { Api } from "../api/client";

// PUBLIC_INTERFACE
export default function VideoPlayerModal({ open, onClose, video }) {
  /**
   * Simple modal overlay that renders video element or external src.
   * Hooks must be called unconditionally; compute derived values first,
   * then return null early based on `open`.
   *
   * Primary stream source is the backend /stream/{id} endpoint via
   * Api.getStreamUrlFor(video.id). If the video fails to load, a
   * lightweight error state is shown instead of a blank player.
   */
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape" && open) onClose && onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  // Reset error when video or open state changes
  useEffect(() => {
    if (open) {
      setLoadError(false);
    }
  }, [open, video]);

  // Compute candidate stream URL (always run hooks before any early return)
  const derived = useMemo(() => {
    const vid = video;
    if (vid && vid.id != null) {
      return Api.getStreamUrlFor(vid.id);
    }
    return "";
  }, [video]);

  if (!open) return null;

  const title = video?.title || "Now Playing";

  // Prefer backend stream endpoint; fallback to any explicit URLs
  const src = derived || video?.stream_url || video?.url || "";

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
          {!src ? (
            <div className="w-full h-full grid place-items-center text-white/80">
              No stream URL available for this video.
            </div>
          ) : loadError ? (
            <div className="w-full h-full grid place-items-center text-white/80 px-4 text-center">
              <div>
                <p className="font-medium mb-1">Unable to load video.</p>
                <p className="text-sm text-gray-300">
                  Please try again in a moment, or choose another title.
                </p>
              </div>
            </div>
          ) : (
            <video
              controls
              className="w-full h-full"
              onError={() => setLoadError(true)}
            >
              <source src={src} />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div>
    </div>
  );
}
