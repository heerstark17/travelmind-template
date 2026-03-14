import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/login";
import Planner from "./pages/Planner";
import Itinerary from "./pages/Itinerary";
import Dashboard from "./pages/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  useEffect(() => {
    const existing = localStorage.getItem("user");
    if (existing) return;

    const match = document.cookie
      .split("; ")
      .find((row) => row.startsWith("tripsera_user="));

    if (!match) return;

    try {
      const value = decodeURIComponent(match.split("=")[1] || "");
      if (value) {
        localStorage.setItem("user", value);
      }
    } catch {
      // ignore malformed cookie
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/planner" element={<Planner />} />
        <Route path="/itinerary" element={<Itinerary />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
