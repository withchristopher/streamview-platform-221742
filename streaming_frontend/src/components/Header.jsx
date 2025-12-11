import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";

 // PUBLIC_INTERFACE
export default function Header({ onSearch, onCategoryChange, categories = [] }) {
  /**
   * Minimalist header with brand, nav, search, and category filter.
   */
  const { isAuthenticated, user, logout } = useAuth();
  const [term, setTerm] = useState("");
  const [category, setCategory] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    onSearch && onSearch(term);
  }, [term, onSearch]);

  useEffect(() => {
    onCategoryChange && onCategoryChange(category);
  }, [category, onCategoryChange]);

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <div className="container-page flex items-center gap-4 py-4">
        <div className="flex items-center gap-6 flex-1">
          <Link to="/" className="font-semibold text-xl">
            <span className="text-text">Stream</span>
            <span className="text-primary">View</span>
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <Link
              to="/"
              className={`text-sm ${location.pathname === "/" ? "text-text" : "text-gray-500"} hover:text-text`}
            >
              Home
            </Link>
            <Link
              to="/library"
              className={`text-sm ${location.pathname === "/library" ? "text-text" : "text-gray-500"} hover:text-text`}
            >
              Library
            </Link>
          </nav>
        </div>

        <div className="hidden lg:flex flex-1 items-center gap-3">
          <SearchBar value={term} onChange={setTerm} placeholder="Search videos..." />
          <CategoryFilter
            value={category}
            onChange={setCategory}
            categories={categories}
          />
        </div>

        <div className="flex items-center gap-3">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="text-sm text-gray-600 hover:text-text">
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm px-3 py-1.5 rounded-md bg-primary text-white hover:opacity-90"
              >
                Sign up
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">{user?.email || "User"}</span>
              <button
                className="text-sm text-gray-600 hover:text-text"
                onClick={() => {
                  logout();
                  if (location.pathname === "/library") navigate("/");
                }}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile tools */}
      <div className="container-page lg:hidden flex flex-col gap-3 pb-3">
        <SearchBar value={term} onChange={setTerm} placeholder="Search videos..." />
        <CategoryFilter
          value={category}
          onChange={setCategory}
          categories={categories}
        />
      </div>
    </header>
  );
}
