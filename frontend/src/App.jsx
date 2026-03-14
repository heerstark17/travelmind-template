import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Trip from "./pages/Trip";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/trip" element={<Trip />} />
        </Routes>

      </div>
    </BrowserRouter>
  );
}

export default App;