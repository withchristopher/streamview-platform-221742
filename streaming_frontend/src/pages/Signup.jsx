import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// PUBLIC_INTERFACE
export default function Signup() {
  const { signup, loading, error, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    const ok = await signup(email, password);
    if (ok) navigate("/");
  }

  if (isAuthenticated) {
    navigate("/");
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container-page py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-semibold mb-6">Sign up</h1>
          {error && (
            <div className="mb-4 rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-2">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-gray-700">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm mb-1 text-gray-700">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-md bg-primary text-white hover:opacity-90 disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>
          <p className="text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:opacity-90">
              Log in
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
