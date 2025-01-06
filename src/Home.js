import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "./logo.png"; // Add your logo file in the src folder
import bgimg from "./file.png";

function Homepage() {
  const navigate = useNavigate();

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </div>
        <nav className="navbar-links">
          <a href="#">Home</a>
          <a href="#">About</a>
          <a href="#">Contact</a>
        </nav>
      </header>

      <main className="homepage-main">
        <div className="homepage-content">
          <h1>Discover the Power of <br /> Social Media Insights</h1>
          <p>
            Unlock insights into social media engagement using Langflow and DataStax.
            Get started by exploring the analytics tool designed to provide dynamic insights.
          </p>
          <button onClick={handleNavigateToChat} className="start-button">
            Start Analysis
          </button>
        </div>
        <div className="homepage-image">
          <img src={bgimg} alt="Analytics" />
        </div>
      </main>

      <footer className="footer">
        <p>&copy; 2025 SploreAI All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;
