/* Axios API client with env-aware baseURL and Authorization header */
import axios from "axios";

const DEFAULT_PORT = 3001;

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Return base URL pointing at backend, driven by env at runtime. */
  const envUrl =
    process.env.REACT_APP_API_BASE_URL ||
    process.env.REACT_APP_BACKEND_URL ||
    "";
  if (envUrl) return envUrl.replace(/\/+$/, "");

  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    // If front on :3000, backend on :3001
    const port = DEFAULT_PORT;
    return `${protocol}//${hostname}:${port}`;
  }
  return `http://localhost:${DEFAULT_PORT}`;
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
});

// Attach token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }
  return config;
});

// PUBLIC_INTERFACE
export const Api = {
  /** Auth endpoints */
  async signup({ email, password }) {
    /**
     * Expected backend path: POST /auth/signup
     * Payload normalized to { email, password }.
     * Response expected to contain either { access_token, user } or simple message.
     */
    return api.post("/auth/signup", { email, password }).then((r) => r.data);
  },
  async login({ email, password }) {
    /**
     * Expected backend path: POST /auth/login
     * Payload normalized to { email, password }.
     * Response expected to contain { access_token, user }.
     */
    return api.post("/auth/login", { email, password }).then((r) => r.data);
  },

  /** Videos */
  async listVideos(params = {}) {
    /**
     * GET /videos
     * Returns either an array or an object like { items: [], total: n }
     */
    return api.get("/videos", { params }).then((r) => r.data);
  },
  async getCategories() {
    return api.get("/categories").then((r) => r.data);
  },
  async getVideoById(id) {
    return api.get(`/videos/${id}`).then((r) => r.data);
  },

  /** Optional helper: construct a playable URL if backend exposes /videos/:id/stream */
  getStreamUrlFor(id) {
    const base = getApiBaseUrl();
    return `${base}/videos/${id}/stream`;
  },
};

export default api;
