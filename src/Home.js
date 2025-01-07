import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import logo from "./logo.png"; // Add your logo file in the src folder
import bgimg from "./file.png";
import personImage1 from "./15.jpg";
import personImage2 from "./16.jpg";
import personImage3 from "./17.jpg";
import tool from "./tool.png";
import mgglass from "./magnifying-glass.png.png";

function Homepage() {
  const navigate = useNavigate();

  const handleNavigateToChat = () => {
    navigate("/chat");
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </div>
        <nav className="navbar-links">
  <a href="#" onClick={() => scrollToSection("home-section")}>Home</a>
  <a href="#" onClick={() => scrollToSection("about-section")}>About</a>
  <a href="#" onClick={handleNavigateToChat}>Analyse</a>
  <a href="#" onClick={() => scrollToSection("contact-section")}>Contact Us</a>
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
          <img src={bgimg} alt="Analytics" className="social-media-icons" />
          <img src={mgglass} alt="Magnifying Glass" className="magnifying-glass" />
        </div>
      </main>

      {/* Merged About Page Content */}
      <div className="about-container">
        <section className="tool-description" id="about-section">
          <img src={tool} alt="Tool Illustration" className="tool-image" />
          <div>
            <h1>About Our Tool</h1>
            <p>
              Discover a seamless way to enhance your workflow with our tool. Built with
              cutting-edge technology, our platform streamlines processes, boosts
              efficiency, and ensures remarkable results for all your needs.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-box feature-box1">
              <h3>Intuitive Design</h3>
              <p>Effortless navigation and user-friendly interface.</p>
            </div>
            <div className="feature-box feature-box2">
              <h3>Seamless Integration</h3>
              <p>Easily connect with your existing tools and workflows.</p>
            </div>
            <div className="feature-box feature-box3">
              <h3>Real-Time Insights</h3>
              <p>Access actionable data when you need it most.</p>
            </div>
            <div className="feature-box feature-box4">
              <h3>Advanced Analytics</h3>
              <p>Gain deeper understanding with cutting-edge analytics.</p>
            </div>
          </div>
        </section>

        {/* Team Members Section */}
        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p>
            Behind every great tool is an incredible team. Meet the minds who
            made it possible.
          </p>
          <div className="team-grid">
            <div className="team-member">
              <img src={personImage1} alt="Team Member 1" />
              <p>Sarang Kadukar<br />- Front-End Developer</p>
            </div>
            <div className="team-member">
              <img src={personImage2} alt="Team Member 2" />
              <p>T.V.Vishalkirthik<br />- Back-End Developer</p>
            </div>
            <div className="team-member">
              <img src={personImage3} alt="Team Member 3" />
              <p>Meenal Sharma<br />- Graphic Designer</p>
            </div>
          </div>
        </section>
        <section className="contact-section" id="contact-section">
  <div className="contact-left">
    <h2>Contact Us</h2>
    <p>If you appreciate our work or have a query, hit us up.<br/> We’d love to hear from you!</p>
  </div>
  <div className="contact-right">
    <div className="contact-form-block">
      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" placeholder="Your Name" required />
        </div>
        <div className="form-group">
          <label htmlFor="message">Message</label>
          <textarea id="message" placeholder="Your Message" rows="4" required></textarea>
        </div>
        <button type="submit" className="submit-button">Submit</button>
      </form>
    </div>
  </div>
</section>




      </div>
   <footer className="footer">
        <p>&copy; 2025 SploreAI All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Homepage;