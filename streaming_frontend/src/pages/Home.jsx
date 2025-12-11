import Header from "../components/Header";
import VideoCard from "../components/VideoCard";
import VideoPlayerModal from "../components/VideoPlayerModal";
import { useState } from "react";
import useVideos from "../hooks/useVideos";

 // PUBLIC_INTERFACE
export default function Home() {
  const { videos, categories, setQuery, setCategory, loading, error } =
    useVideos();
  const [playing, setPlaying] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <Header
        onSearch={setQuery}
        onCategoryChange={setCategory}
        categories={categories}
      />
      <main className="container-page py-8">
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
      </main>
      <VideoPlayerModal
        open={!!playing}
        video={playing}
        onClose={() => setPlaying(null)}
      />
    </div>
  );
}
