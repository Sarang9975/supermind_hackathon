import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import "./LangFlowPage.css";
import sonetlogo from "./sonetlogo.png";
import logo from "./logo.png";
import { FaCopy, FaPaperclip } from "react-icons/fa";
import Analysis from "./Analysis";

const PROXY_URL = "http://localhost:3001/proxy";

function LangFlowPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showAboutSection, setShowAboutSection] = useState(true);
  const [buttonHighlight, setButtonHighlight] = useState(false);
  const [showTips, setShowTips] = useState(false); // Tips visibility state

  const handleSubmit = async (input = userInput) => {
    if (!input.trim() || loading) return;

    const userMessage = { type: "user", text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setShowChatBox(true);
    setShowAboutSection(false);

    setLoading(true);
    setButtonHighlight(false);
    try {
      const data = {
        input_value: input,
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
      setButtonHighlight(true);
      setShowTips(true); // Show tips after sending a message
    }

    setUserInput("");
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert("Copied to clipboard!");
      },
      () => {
        alert("Failed to copy text.");
      }
    );
  };

  const handleTipClick = (text) => {
    handleSubmit(text); // Directly send the clicked prompt text
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  return (
    <>
      {/* Navbar */}
      <header className="chat-navbar">
        <div className="chat-navbar-left">
          <img src={logo} alt="Logo" className="chat-navbar-logo-img" />
        </div>
        <nav className="chat-navbar-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/chat">Analyse</a>
          <a href="/">Contact Us</a>
        </nav>
      </header>

      <div className="chatpage-main-container">
        {/* Tips Section */}
        {showTips && (
          <div className="tips-section">
            <h3 className="tips-box-heading">Here are some Tips</h3>
            <div className="tip-boxes-container">
              <div className="tip-box">
                1. Type clear and concise questions.
              </div>
              <div className="tip-box">
                2. Ask about anything you need help with.
              </div>
              <div className="tip-box">
                3. Explore Sonnet's suggestions for better results.
              </div>
              <div className="tip-box">4. Interact to refine your queries.</div>
            </div>
          </div>
        )}

        {/* Chat Section */}
        <div className="chat-container">
          {/* About Sonnet Section */}
          {showAboutSection && (
            <div className="about-sonnet">
              <div className="about-sonnet-text">
                <div className="logo-container">
                  <img
                    src={sonetlogo}
                    alt="Sonnet Logo"
                    className="sonnet-logo"
                  />
                  <h1 className="sonnet-heading">Sonnet 1.0</h1>
                </div>
                <p className="sonet-details">
                  Sonnet: Your AI-powered compass for decoding social media
                  dynamics.
                  <br /> Ask anything, and let Sonnet reveal the story behind
                  the stats!
                </p>
                {/* Prompts Section */}
                <div className="prompts-section">
                  <h3 className="prompts-box-heading">Here are some Prompts</h3>
                  <div className="prompts-boxes-container">
                    <div
                      className="prompts-box"
                      onClick={() =>
                        handleTipClick("Compare between reels and carousel?")
                      }
                    >
                      1. Compare between reels and carousel?
                    </div>
                    <div
                      className="prompts-box"
                      onClick={() =>
                        handleTipClick("Which is the highest performing post?")
                      }
                    >
                      2. Which is the highest performing post?
                    </div>
                    <div
                      className="prompts-box"
                      onClick={() =>
                        handleTipClick("Which posts should I upload often?")
                      }
                    >
                      3. Which posts should I upload often?
                    </div>
                    <div
                      className="prompts-box"
                      onClick={() =>
                        handleTipClick("Suggest me some content strategy.")
                      }
                    >
                      4. Suggest me some content strategy
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Chat Box */}
          {showChatBox && (
            <div className="chat-box animated-fade-in">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`chat-message ${
                    message.type === "user" ? "user" : "bot"
                  }`}
                  style={{ position: "relative" }}
                >
                  <div
                    className="message-bubble"
                    style={{ position: "relative" }}
                  >
                    {message.type === "bot" ? (
                      <>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: marked(message.text),
                          }}
                          style={{ flex: 1 }}
                        />
                        <button
                          onClick={() => copyToClipboard(message.text)}
                          style={{
                            position: "absolute",
                            margin: "5px",
                            top: "5px",
                            right: "8px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                        >
                          <FaCopy
                            style={{ color: "#6a6a6a", fontSize: "1.2em" }}
                          />
                        </button>
                      </>
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
          )}

          <div className="input-container">
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask whatever you want..."
              className="input-box"
            />
            <button className="attachment-button">
              <FaPaperclip />
            </button>
            <button
              onClick={() => handleSubmit()}
              className={`send-button ${buttonHighlight ? "highlight" : ""}`}
              disabled={loading}
              >
              {loading ? <div className="loader"></div> : "Send"}
            </button>
            <div>
              <Analysis/>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LangFlowPage;
