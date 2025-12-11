import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import VideoPlayerModal from "../components/VideoPlayerModal";
import { useState } from "react";
import useVideos from "../hooks/useVideos";
import useAuth from "../hooks/useAuth";
import { Link } from "react-router-dom";

// PUBLIC_INTERFACE
export default function Library() {
  const { isAuthenticated } = useAuth();
  const { videos, categories, setQuery, setCategory, loading, error } = useVideos();
  const [playing, setPlaying] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearch={setQuery}
        onCategoryChange={setCategory}
        categories={categories}
      />
      <main className="container-page py-8">
        {!isAuthenticated ? (
          <div className="rounded-lg border border-gray-200 p-6 bg-surface">
            <h2 className="text-lg font-semibold mb-2">Your library</h2>
            <p className="text-gray-600">
              Please{" "}
              <Link to="/login" className="text-primary hover:opacity-90">
                log in
              </Link>{" "}
              to view your saved videos and continue watching.
            </p>
          </div>
        ) : (
          <>
            {error && (
              <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2">
                {error}
              </div>
            )}
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="aspect-video bg-surface rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {videos.map((v) => (
                  <VideoCard key={v.id || v.title} video={v} onClick={setPlaying} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <VideoPlayerModal
        open={!!playing}
        video={playing}
        onClose={() => setPlaying(null)}
      />
    </div>
  );
}
