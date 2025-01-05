import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Home";
import LangFlowPage from "./LangFlowPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the homepage */}
        <Route path="/" element={<Homepage />} />
        
        {/* Route for the LangFlow chat page */}
        <Route path="/chat" element={<LangFlowPage />} />
      </Routes>
    </Router>
  );
}

export default App;
