import { useCallback, useEffect, useMemo, useState } from "react";
import { Api } from "../api/client";

// PUBLIC_INTERFACE
export function useAuth() {
  /**
   * Manage auth token and user state.
   * Provides login, signup, logout, and guards.
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
      if (data?.access_token) setToken(data.access_token);
      if (data?.user) setUser(data.user);
      else setUser({ email });
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

  return { token, user, loading, error, isAuthenticated, login, signup, logout };
}

export default useAuth;
