import { useCallback, useEffect, useState } from "react";
import { Api } from "../api/client";

// PUBLIC_INTERFACE
export function useVideos(initialQuery = "") {
  /**
   * Fetch and filter videos from backend, supporting query and category.
   *
   * - Sends `q` for search term when present.
   * - Sends `category_id` when a category is selected. The incoming category
   *   may be an id string, number, or full category object.
   * - Normalizes thumbnails using backend `thumbnail_url` field when provided.
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

      // Preserve search param `q`
      if (query) {
        params.q = query;
      }

      // Map selected category to category_id (supports string / number / object)
      if (category) {
        if (typeof category === "object") {
          const catId = category.id ?? category.category_id ?? category.value;
          if (catId != null && catId !== "") {
            params.category_id = catId;
          }
        } else {
          params.category_id = category;
        }
      }

      const data = await Api.listVideos(params);
      const items = Array.isArray(data) ? data : data?.items || [];

      // Normalize minimal fields used in UI
      const normalized = items.map((v) => ({
        id: v.id ?? v.video_id ?? v._id ?? v.slug ?? undefined,
        title: v.title ?? v.name ?? "Untitled",
        // Prefer backend "thumbnail_url" first per contract, fallback to previous shapes
        thumbnail:
          v.thumbnail_url ??
          v.thumbnail ??
          v.poster ??
          v.cover_image ??
          undefined,
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
