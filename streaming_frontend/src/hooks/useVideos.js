import { useCallback, useEffect, useState } from "react";
import { Api } from "../api/client";

// PUBLIC_INTERFACE
export function useVideos(initialQuery = "") {
  /**
   * Fetch and filter videos from backend, supporting query and category.
   */
  const [videos, setVideos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchCategories = useCallback(async () => {
    try {
      const data = await Api.getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch {
      // silent fail; categories optional
      setCategories([]);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = {};
      if (query) params.q = query;
      if (category) params.category = category;

      const data = await Api.listVideos(params);
      const items = Array.isArray(data) ? data : data?.items || [];
      // Normalize minimal fields used in UI
      const normalized = items.map((v) => ({
        id: v.id ?? v.video_id ?? v._id ?? v.slug ?? undefined,
        title: v.title ?? v.name ?? "Untitled",
        thumbnail: v.thumbnail ?? v.poster ?? v.cover_image ?? undefined,
        stream_url: v.stream_url ?? v.url ?? undefined,
        ...v,
      }));
      setVideos(normalized);
    } catch (e) {
      setError(e?.response?.data?.detail || "Failed to load videos");
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  return {
    videos,
    categories,
    query,
    setQuery,
    category,
    setCategory,
    loading,
    error,
    refetch: fetchVideos,
  };
}

export default useVideos;
