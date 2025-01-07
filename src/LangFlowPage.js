import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import "./LangFlowPage.css";
import sonetlogo from "./sonetlogo.png";
import logo from "./logo.png"

const PROXY_URL = "http://localhost:3001/proxy";

function LangFlowPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) return;

    const userMessage = { type: "user", text: userInput };
    setChatHistory((prev) => [...prev, userMessage]);

    setLoading(true);
    try {
      const data = {
        input_value: userInput,
        output_type: "chat",
        input_type: "chat",
        tweaks: {
          "Agent-tJqJc": {},
          "ChatInput-d4LdR": {},
          "ChatOutput-rPWRg": {},
          "AstraDBToolComponent-JJ67v": {},
          "Prompt-bNzEw": {},
        },
      };

      const response = await axios.post(PROXY_URL, data, {
        headers: { "Content-Type": "application/json" },
      });

      const text =
        response.data.outputs[0]?.outputs[0]?.results?.message?.text ||
        "No response text found.";
      setChatHistory((prev) => [...prev, { type: "bot", text }]);
    } catch (error) {
      console.error("Error:", error);
      setChatHistory((prev) => [
        ...prev,
        { type: "bot", text: "Error: Failed to get response from the server." },
      ]);
    } finally {
      setLoading(false);
    }

    setUserInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <>
      {/*Navbar*/}
      <header className="chat-navbar">
        <div className="chat-navbar-left">
          <img src={logo} alt="Logo" className="chat-navbar-logo-img" />
        </div>
        <nav className="chat-navbar-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/chat">Analyse</a>
        </nav>
      </header>

      <div className="chatpage-main-container">

        {/* Tips Section */}
        <div className="tips-section">
          <h3 className="tips-box-heading">Here are some Tips </h3>
          <div className="tip-boxes-container">
            <div className="tip-box">1. Type clear and concise questions.</div>
            <div className="tip-box">2. Ask about anything you need help with.</div>
            <div className="tip-box">3. Explore Sonnet's suggestions for better results.</div>
            <div className="tip-box">4. Interact to refine your queries.</div>
          </div>
        </div>



        {/* Chat Section */}
        <div className="chat-container">
          {/* About Sonnet Section */}
          <div className="about-sonnet">
            <div className="about-sonnet-text">
              <div className="logo-container">
                <img src={sonetlogo} alt="Sonnet Logo" className="sonnet-logo" />
                <h1 className="sonnet-heading">Sonnet 1.0</h1>
              </div>
              <p className="sonet-details">
                Sonnet is your AI-powered assistant for smarter, faster, and more intuitive workflows. <br/> Ask anything, and let Sonnet handle the rest!
              </p>
            </div>
          </div>

          {/* Greetings Section */}
          <header className="header">
            <h1 className="title">Hi there,👋 </h1>
            <h2 className="subtitle">Would you like to know Insight based on the Social Media Data? </h2>
          </header>
          <div className="chat-box">
            {chatHistory.map((message, index) => (
              <div
                key={index}
                className={`chat-message ${message.type === "user" ? "user" : "bot"}`}
              >
                <div className="message-bubble">
                  {message.type === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{ __html: marked(message.text) }}
                    />
                  ) : (
                    message.text
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="chat-message bot">
                <div className="message-bubble">Loading...</div>
              </div>
            )}
          </div>

          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Ask whatever you want..."
              className="input-box"
            />
            <button onClick={handleSubmit} className="send-button">
              Send
            </button>
          </div>

        </div>

      </div>
    </>
  );
}

export default LangFlowPage;
