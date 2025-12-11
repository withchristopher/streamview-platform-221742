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
  async signup(payload) {
    // expected backend path; adjust if backend differs
    return api.post("/auth/signup", payload).then((r) => r.data);
  },
  async login(payload) {
    return api.post("/auth/login", payload).then((r) => r.data);
  },
  /** Videos */
  async listVideos(params = {}) {
    return api.get("/videos", { params }).then((r) => r.data);
  },
  async getCategories() {
    return api.get("/categories").then((r) => r.data);
  },
  async getVideoById(id) {
    return api.get(`/videos/${id}`).then((r) => r.data);
  },
};

export default api;
