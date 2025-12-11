import { useCallback, useEffect, useMemo, useState } from "react";
import { Api } from "../api/client";

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Manage auth token and user state.
   * Provides login, signup, logout, and guards.
   *
   * Token handling:
   * - Expects backend responses shaped like { access_token, token_type, user? }.
   * - Persists `access_token` in localStorage under key "token".
   * - If backend does not send a user payload, a minimal user object with the
   *   provided email is stored.
   *
   * This hook is also ready to optionally fetch user details from /auth/me
   * when a token exists. That call is intentionally left as a guarded,
   * non-blocking enhancement so the app continues to work even if the
   * endpoint is not implemented.
   */
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.login({ email, password });

      // Store access_token from backend; ignore token_type for now.
      if (data?.access_token) {
        setToken(data.access_token);
      }

      // Prefer backend-supplied user model, otherwise retain minimal user.
      if (data?.user) {
        setUser(data.user);
      } else {
        setUser({ email });
      }

      return true;
    } catch (e) {
      setError(e?.response?.data?.detail || "Login failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const data = await Api.signup({ email, password });

      if (data?.access_token) {
        setToken(data.access_token);
      }

      if (data?.user) {
        setUser(data.user);
      } else {
        setUser({ email });
      }

      return true;
    } catch (e) {
      setError(e?.response?.data?.detail || "Signup failed");
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = useMemo(() => Boolean(token), [token]);

  // Optional, non-blocking user refresh hook-in point.
  // If in future /auth/me is implemented, this block can be enabled:
  //
  // useEffect(() => {
  //   let cancelled = false;
  //   async function fetchMe() {
  //     if (!token || user) return;
  //     try {
  //       const me = await Api.me();
  //       if (!cancelled && me) setUser(me);
  //     } catch {
  //       // ignore - optional enhancement
  //     }
  //   }
  //   fetchMe();
  //   return () => {
  //     cancelled = true;
  //   };
  // }, [token, user]);

  return { token, user, loading, error, isAuthenticated, login, signup, logout };
}

export default useAuth;
