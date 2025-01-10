import React, { useState, useEffect } from "react";
import { useNavigate , useLocation} from "react-router-dom";
import emailjs from "emailjs-com";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Home.css";
import logo from "./logo.png"; // Add your logo file in the src folder
import bgimg from "./file.png";
import personImage1 from "./15.jpg";
import personImage2 from "./16.jpg";
import personImage3 from "./17.jpg";
import personImage4 from "./18.jpg"; // Add photo for Mathew Binoy
import tool from "./tool.png";
import mgglass from "./magnifying-glass.png.png";
import linkedin from "./linkedin.png";

function Homepage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (location.state?.sectionId) {
      const section = document.getElementById(location.state.sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    // Initialize AOS for animations
    AOS.init({ duration: 1000, offset: 100 });
  }, []);

  const handleNavigateToChat = () => {
    navigate("/chat");
  };


  const handleNavigateToDashboard = () => {
    navigate("/dashboard");
  };

  const handleNavigateToHome = (sectionId) => {
    if (window.location.pathname === "/") {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/", { state: { sectionId } });
    }
  };

  
  
  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    emailjs
      .send(
        "service_igs3xyk",
        "template_j48mytk",
        formData,
        "Q_whiE7JI0DLwR8OB"
      )
      .then((response) => {
        setIsSubmitted(true); // Show success message
        console.log("Response:", response);
      })
      .catch((error) => {
        alert("Failed to send the message. Please try again.");
        console.error("Error:", error);
      });
  };



  return (
    <div className="homepage-container">
      <header className="navbar">
        <div className="navbar-left">
          <img src={logo} alt="Logo" className="navbar-logo-img" />
        </div>
        <nav className="navbar-links">
          <a href="#" onClick={() => scrollToSection("home-section")}>Home</a>
          <a href="#" onClick={handleNavigateToDashboard}>Dashboard</a>
          <a
  href="#about-section"
  onClick={(e) => {
    e.preventDefault();
    handleNavigateToHome("about-section");
  }}
>
  About
</a>
          <a href="#" onClick={handleNavigateToChat}>Analyse</a>
          
       
<a
  href="#contact-section"
  onClick={(e) => {
    e.preventDefault();
    handleNavigateToHome("contact-section");
  }}
>
  Contact Us
</a>

        </nav>
      </header>

      <main className="homepage-main">
        <div className="homepage-content">
          <h1>Discover the Power of <br /> Social Media Insights</h1>
          <p>
            Unlock insights into social media engagement using Langflow and DataStax.
            Get started by exploring the analytics tool designed to provide dynamic insights.
          </p>
          <div className="button-group">
            <button onClick={handleNavigateToChat} className="start-button">
              Start Analysis
            </button>
            <button
  onClick={() => window.open("https://www.youtube.com/watch?v=chMlrLQhqIY", "_blank")}
  className="view-demo-button"
>
  View Demo
</button>

          </div>
        </div>

        <div className="homepage-image">
          <img src={bgimg} alt="Analytics" className="social-media-icons" />
          <img src={mgglass} alt="Magnifying Glass" className="magnifying-glass" />
        </div>
      </main>

      <div className="about-container">
        <section className="tool-description" id="about-section" data-aos="fade-right">
          <img src={tool} alt="Tool Illustration" className="tool-image" data-aos="fade-left" />
          <div>
            <h1>About Our Tool</h1>
            <p>
              Discover a seamless way to enhance your workflow with our tool. Built with
              cutting-edge technology, our platform streamlines processes, boosts
              efficiency, and ensures remarkable results for all your needs.
            </p>
          </div>
        </section>

        <section className="features-section">
          <h2>Key Features</h2>
          <div className="features-grid">
            <div className="feature-box feature-box1" data-aos="fade-up-right">
              <h3>Intuitive Design</h3>
              <p>Effortless navigation and user-friendly interface.</p>
            </div>
            <div className="feature-box feature-box2" data-aos="fade-up-right">
              <h3>Seamless Integration</h3>
              <p>Easily connect with your existing tools and workflows.</p>
            </div>
            <div className="feature-box feature-box3" data-aos="fade-up-left">
              <h3>Real-Time Insights</h3>
              <p>Access actionable data when you need it most.</p>
            </div>
            <div className="feature-box feature-box4" data-aos="fade-up-left">
              <h3>Advanced Analytics</h3>
              <p>Gain deeper understanding with cutting-edge analytics.</p>
            </div>
          </div>
        </section>

        <section className="team-section">
          <h2>Meet Our Team</h2>
          <p>
            Behind every great tool is an incredible team. Meet the minds who made it possible.
          </p>
          <div className="team-grid">
            <div className="team-member" data-aos="fade-right">
              <div className="team-image-container">
                <img src={personImage1} alt="Team Member 1" />
                <a
                  href="https://www.linkedin.com/in/sarangkadukar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </div>
              <p>Sarang Kadukar<br />- Front-End Developer</p>
            </div>
            <div className="team-member" data-aos="fade-left">
              <div className="team-image-container">
                <img src={personImage2} alt="Team Member 2" />
                <a
                  href="https://www.linkedin.com/in/vishalkirthik"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </div>
              <p>T.V.Vishalkirthik<br />- Back-End Developer</p>
            </div>
            <div className="team-member" data-aos="fade-right">
              <div className="team-image-container">
                <img src={personImage3} alt="Team Member 3" />
                <a
                  href="https://www.linkedin.com/in/meenal-sharma-699a4a280"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </div>
              <p>Meenal Sharma<br />- Graphic Designer</p>
            </div>
            <div className="team-member" data-aos="fade-left">
              <div className="team-image-container">
                <img src={personImage4} alt="Team Member 4" />
                <a
                  href="https://www.linkedin.com/in/rishikesh-koli-828248257"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="linkedin-icon"
                >
                  <img src={linkedin} alt="linkedin" />
                </a>
              </div>
              <p>Rishikesh Koli<br/>- Full Stack Developer</p>
            </div>
          </div>
        </section>

        <section className="contact-section" id="contact-section">
          <div className="contact-left" data-aos="fade-right">
            <h2>Contact Us</h2>
            <p>If you appreciate our work or have a query, hit us up.<br /> We’d love to hear from you!</p>
          </div>
          <div className="contact-right" data-aos="fade-left">
            <div className="contact-form-block">
              {isSubmitted ? (
                <div className="success-message">
                  <span className="tick-icon">✔</span> Message Sent!
                </div>
              ) : (
                <form className="contact-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="message">Message</label>
                    <textarea
                      id="message"
                      placeholder="Your Message"
                      rows="4"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                  <button type="submit" className="submit-button">Submit</button>
                </form>
              )}
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
