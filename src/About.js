import React from "react";
import "./About.css";
import logo from "./logo.png";
import personImage1 from "./15.png";
import personImage2 from "./16.png";
import personImage3 from "./17.png";
import tool from "./tool.png";

const About = () => {
  return (
    <div>
      {/* Navbar */}
      <nav className="about-navbar">
        <div className="about-navbar-logo">
          <img src={logo} alt="Logo" className="chat-navbar-logo-img" />
        </div>
        <div className="about-navbar-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
        </div>
      </nav>

      {/* About Page Content */}
      <div className="about-container">
        {/* Tool Description Section */}
        <section className="tool-description">
          <h1>About Our Tool</h1>
          <p>
            Discover a seamless way to enhance your workflow with our tool. 
            Built with cutting-edge technology, our platform streamlines 
            processes, boosts efficiency, and ensures remarkable results for 
            all your needs.
          </p>
          <img
            src={tool}
            alt="Tool Illustration"
            className="tool-image"
          />
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
              <p>Sarang Kadukar - Developer and Designer</p>
            </div>
            <div className="team-member">
              <img src={personImage2} alt="Team Member 2" />
              <p>T.V.Vishalkirthik - Full Stack Developer</p>
            </div>
            <div className="team-member">
              <img src={personImage3} alt="Team Member 3" />
              <p>Enoch Carlo - Team Booster</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default About;
