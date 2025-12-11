import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Library from "./pages/Library";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

// PUBLIC_INTERFACE
export default function RoutesRoot() {
  /** Defines top-level app routes */
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/library" element={<Library />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
