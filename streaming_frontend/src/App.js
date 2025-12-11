import React from "react";
import { BrowserRouter } from "react-router-dom";
import RoutesRoot from "./routes";
import "./App.css";

// PUBLIC_INTERFACE
function App() {
  /** Root app that attaches Router and renders routes */
  return (
    <div className="min-h-screen bg-white text-text">
      <BrowserRouter>
        <RoutesRoot />
      </BrowserRouter>
    </div>
  );
}

export default App;
