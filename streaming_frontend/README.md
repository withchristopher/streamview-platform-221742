# StreamView Frontend (React + Tailwind)

## Overview

StreamView Frontend is a minimalist React application styled with Tailwind CSS that provides a Netflix-style UI for browsing, searching, and streaming video content. It communicates with the FastAPI backend via REST APIs and a streaming proxy endpoint.

The typical development setup runs:

- Backend (FastAPI): **http://localhost:3001**
- Frontend (React dev server): **http://localhost:3000**

In the KAVIA preview environment, these are usually exposed at ports `3001` (backend) and `3000` (frontend) on the preview host.

## Prerequisites

- Node.js 18+ (recommended)
- npm

All frontend dependencies are declared in `package.json`.

## Installation

From the frontend container root (`streamview-platform-221742/streaming_frontend`):

```bash
npm install
```

This will install React, React Router, Axios, Tailwind, and supporting tooling.

## Running the Frontend Locally

From `streamview-platform-221742/streaming_frontend`:

```bash
# Start the React development server on port 3000
npm start
```

By default, this will open the app at:

- <http://localhost:3000>

The frontend expects the backend to be running (by default) at **http://localhost:3001**. You can override this with environment variables as described below.

In the KAVIA preview environment, the frontend is typically reachable at a URL similar to:

- `https://<preview-host>:3000`

Use the corresponding backend URL (e.g. `https://<preview-host>:3001`) as your API base URL.

## Environment Configuration

The frontend primarily uses `REACT_APP_API_BASE_URL` to determine which backend to call. Additional environment variables may be present in the container configuration, but most are not used directly by this app.

### Core API Base URL

The Axios client at `src/api/client.js` resolves its base URL as follows:

1. `process.env.REACT_APP_API_BASE_URL`, if set  
2. `process.env.REACT_APP_BACKEND_URL`, if set  
3. Otherwise, it infers `http(s)://<host>:3001` from the current window location  
4. As a final fallback (non-browser environments), it uses `http://localhost:3001`

**Recommended variable:**

- `REACT_APP_API_BASE_URL`  
  Defines the base URL for all API calls, including streaming.

  - Local example:

    ```bash
    REACT_APP_API_BASE_URL=http://localhost:3001
    ```

  - Preview example:

    ```bash
    REACT_APP_API_BASE_URL=https://<preview-host>:3001
    ```

### Container Environment Variables

The container may define a broader set of environment variables, for example:

- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_WS_URL`
- `REACT_APP_NODE_ENV`
- `REACT_APP_NEXT_TELEMETRY_DISABLED`
- `REACT_APP_ENABLE_SOURCE_MAPS`
- `REACT_APP_PORT`
- `REACT_APP_TRUST_PROXY`
- `REACT_APP_LOG_LEVEL`
- `REACT_APP_HEALTHCHECK_PATH`
- `REACT_APP_FEATURE_FLAGS`
- `REACT_APP_EXPERIMENTS_ENABLED`
- `REACT_APP_REACT_APP_API_BASE_URL`
- `REACT_APP_JWT_SECRET`
- `REACT_APP_JWT_ALGORITHM`
- `REACT_APP_JWT_EXPIRE_MINUTES`

Most of these are generic container settings and are **not** currently consumed by the React app. The important configuration for backend communication remains:

- `REACT_APP_API_BASE_URL`
- (optional fallback) `REACT_APP_BACKEND_URL`

### Local `.env` Example

Create a `.env` file in `streamview-platform-221742/streaming_frontend` for local development:

```bash
REACT_APP_API_BASE_URL=http://localhost:3001
```

Then run:

```bash
npm start
```

The Create React App dev server will read this configuration, and the Axios client will call `http://localhost:3001` for all API requests.

## How the Frontend Uses the Backend

### API Client

The module `src/api/client.js` defines a reusable Axios instance and a small API wrapper:

- Base URL resolution as described above
- An interceptor that:
  - Reads the JWT token from `localStorage` under the key `token`
  - Adds `Authorization: Bearer <token>` to all outgoing requests when present

Exposed helper methods:

- `Api.signup({ email, password })` → `POST /auth/signup`
- `Api.login({ email, password })` → `POST /auth/login`
- `Api.listVideos(params)` → `GET /videos` with `q` and `category_id` query params
- `Api.getCategories()` → `GET /categories`
- `Api.getVideoById(id)` → `GET /videos/{id}`
- `Api.getStreamUrlFor(id)` → Returns `{API_BASE_URL}/stream/{id}` (used for video playback)

### Authentication Flow

The hook `src/hooks/useAuth.js`:

- Manages JWT token and user state in React
- Persists the token to `localStorage` under `"token"` and user data under `"user"`
- Provides:

  - `login(email, password)`
  - `signup(email, password)`
  - `logout()`
  - `isAuthenticated`
  - `user`, `token`, `loading`, `error`

On successful signup or login:

- Expects the backend to respond with `{ "access_token": "...", "token_type": "bearer" }` (and optionally a `user` payload).
- Stores the `access_token` in `localStorage` and uses it for all subsequent API calls.

### Data / Video Flow

The hook `src/hooks/useVideos.js`:

- Fetches categories via `GET /categories`
- Fetches videos via `GET /videos` with support for:
  - `q` (search term)
  - `category_id` (selected category)
- Normalizes video metadata to the shape used by the UI:
  - `id`
  - `title`
  - `thumbnail` (prefers backend `thumbnail_url`)

The UI components:

- `Home.jsx` and `Library.jsx` pages:
  - Render search and category filters via `Header`
  - Display `VideoCard` components in a responsive grid
  - Open `VideoPlayerModal` when a video is selected

### Streaming

`VideoPlayerModal` uses `Api.getStreamUrlFor(video.id)` to construct the streaming URL:

- `GET {API_BASE_URL}/stream/{id}`

The `<video>` element has a `<source>` pointing at this URL and supports standard HTML5 controls and native seeking, relying on the backend’s HTTP Range support and exposed headers.

## Key Backend Endpoints the Frontend Uses

For quick reference, the frontend integrates with these backend endpoints:

- `POST /auth/login`
- `POST /auth/signup`
- `GET /auth/me` (optional future enhancement, currently not called by default)
- `GET /videos/`
- `GET /videos/{video_id}`
- `GET /categories/`
- `GET /stream/{video_id}`

Ensure the backend is reachable at the configured `REACT_APP_API_BASE_URL` and that these paths are available.

## Running the Full Stack Locally

1. **Start the backend** (from `streamview-platform-221741/streaming_backend`):

   ```bash
   uvicorn src.api.main:app --reload --host 0.0.0.0 --port 3001
   ```

2. **Configure the frontend** (from `streamview-platform-221742/streaming_frontend`):

   Create `.env`:

   ```bash
   REACT_APP_API_BASE_URL=http://localhost:3001
   ```

3. **Start the frontend dev server**:

   ```bash
   npm install
   npm start
   ```

4. **Browse the app**:

   - Open <http://localhost:3000>
   - Sign up or log in
   - Use search and categories to browse seeded sample videos
   - Click a video card to open the streaming modal and watch the video

## Notes About Outbound Internet and CORS

### Outbound Internet

The backend streams remote MP4 files from public URLs (e.g. Google sample video bucket). For playback to work:

- The backend must be able to reach the external MP4 URLs.
- If outbound connections are blocked or restricted, `/stream/{id}` responses will fail and the player will show an error state.

This is an infrastructure concern (backend connectivity), but you will see the symptoms in the frontend as videos failing to load.

### CORS

The backend configures permissive CORS:

- `allow_origins=["*"]`
- `allow_methods=["*"]`
- `allow_headers=["*", "Authorization", "Range"]`
- `expose_headers=["Content-Range", "Accept-Ranges", "Content-Length", "Content-Type"]`

This allows:

- The React dev server on `http://localhost:3000`
- Browser-based previews on `https://<preview-host>:3000`

to access the backend APIs and streaming endpoints without extra CORS configuration in the frontend.

## Troubleshooting

If things are not working as expected, use the checklist below.

### 1. Streaming fails or video does not play

Symptoms:

- Video player shows an error message like “Unable to load video.”
- Endless spinner or blank player

Checks:

1. **Backend reachable**

   - Visit the backend health and docs from the same browser:
     - <http://localhost:3001/>
     - <http://localhost:3001/docs>
   - In preview, check:
     - `https://<preview-host>:3001/`
     - `https://<preview-host>:3001/docs`

2. **Correct API base URL**

   - Confirm `REACT_APP_API_BASE_URL` (or `REACT_APP_BACKEND_URL`) is set to the correct backend origin.
   - In DevTools → Network, inspect requests:
     - `/videos`
     - `/categories`
     - `/stream/{id}`
   - They should be going to the same host and port as your backend.

3. **Token in `localStorage`**

   - Open DevTools → Application → Local Storage → `http://localhost:3000`
   - Ensure a `token` entry exists after logging in or signing up.
   - Requests should include `Authorization: Bearer <token>` in headers.

4. **Outbound internet**

   - If `/stream/{id}` returns 4xx/5xx, inspect the backend logs for `aiohttp` errors.
   - The backend must be able to reach external MP4 URLs (e.g. `commondatastorage.googleapis.com`).
   - In restricted environments, you may need to update the backend seed data to point at reachable URLs.

### 2. API calls fail with CORS errors

Symptoms:

- Browser console shows CORS warnings or errors when calling `http://localhost:3001` or the preview backend.

Checks:

- Verify the backend is running with the default CORS configuration.
- Ensure you are not accidentally changing `allow_origins` to a single origin that does not match the frontend’s URL.
- Try refreshing the page and clearing cache.

### 3. Authentication not working

Symptoms:

- Login/signup forms always show an error.
- You can see `/auth/login` or `/auth/signup` calls returning 4xx.

Checks:

- Confirm backend JWT environment variables (`JWT_SECRET`, `JWT_ALGORITHM`, `JWT_EXPIRE_MINUTES`) are set correctly.
- Ensure the request payload shape matches expectations:

  ```json
  {
    "email": "user@example.com",
    "password": "plain-text-password"
  }
  ```

- Review backend logs for error traces.

## Project Structure (Frontend)

High-level layout:

- `src/api/client.js` – Axios API client and endpoint helpers
- `src/hooks/useAuth.js` – Authentication state management
- `src/hooks/useVideos.js` – Video and category fetching
- `src/components/` – Header, SearchBar, VideoCard, VideoPlayerModal, CategoryFilter
- `src/pages/` – Home, Library, Login, Signup
- `src/routes.jsx` – Route definitions
- `src/index.css` and `tailwind.config.js` – Tailwind styling and theme tokens

## Summary

- Run backend at **port 3001**, frontend at **port 3000**.
- Configure `REACT_APP_API_BASE_URL` (or `REACT_APP_BACKEND_URL`) so the frontend knows where the backend is.
- Backend exposes key endpoints: `/auth/login`, `/auth/signup`, `/auth/me`, `/videos`, `/categories`, `/stream/{id}`.
- Outbound internet from the backend and permissive CORS settings are required for remote MP4 streaming to work smoothly.
- If streaming fails, first verify backend reachability, API base URL correctness, and presence of the JWT token in `localStorage`.
