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
     * Query params:
     *  - q: optional search query
     *  - category_id: optional category identifier
     *
     * Returns either an array or an object like { items: [], total: n }.
     */
    const normalizedParams = {};
    if (params.q) {
      normalizedParams.q = params.q;
    }
    if (params.category_id) {
      // Already in expected shape from callers.
      normalizedParams.category_id = params.category_id;
    } else if (params.category) {
      // Backwards compatibility: map legacy "category" field to "category_id".
      normalizedParams.category_id = params.category;
    }
    return api
      .get("/videos", { params: normalizedParams })
      .then((r) => r.data);
  },
  async getCategories() {
    /**
     * GET /categories
     * Expected to return a list of category objects like:
     *   { id, name } or { id, title }
     */
    return api.get("/categories").then((r) => r.data);
  },
  async getVideoById(id) {
    /**
     * GET /videos/{id}
     */
    return api.get(`/videos/${id}`).then((r) => r.data);
  },

  /** PUBLIC_INTERFACE
   * Construct a playable URL using the backend /stream/{id} endpoint.
   */
  getStreamUrlFor(id) {
    const base = getApiBaseUrl();
    return `${base}/stream/${id}`;
  },
};

export default api;
