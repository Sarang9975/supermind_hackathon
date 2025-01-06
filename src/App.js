import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Home";
import LangFlowPage from "./LangFlowPage";
import About from "./About";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the homepage */}
        <Route path="/" element={<Homepage />} />
        
        {/* Route for the LangFlow chat page */}
        <Route path="/chat" element={<LangFlowPage />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
