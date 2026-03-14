import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/login";
import Planner from "./pages/Planner";
import Itinerary from "./pages/Itinerary";
import Dashboard from "./pages/Dashboard";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
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
