import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import "./LangFlowPage.css";
import logo from './sonetlogo.jpg';
const PROXY_URL = "http://localhost:3001/proxy";

function LangFlowPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!userInput.trim()) return; // Prevent empty submissions

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

    setUserInput(""); // Clear input after submission
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };

  return (
    <div className="main-container">
      <div className="sidebar">
        <div className="sidebar-heading">
          <h2>Sonet 1.0</h2>
          <img src={logo} width={"50px"} height={"50px"}/>
        </div>
        <div className="about-box">
          <h3 className="about-box-heading">About Sonet 1.0</h3>
          <p>
            Sonet 1.0 is an advanced AI-based tool designed to analyze and provide insights into social media content. Using state-of-the-art natural language processing (NLP) algorithms, Sonet can understand and respond to user queries related to social media trends, statistics, and other related topics.
          </p>
        </div>
        <div className="tips-box">
          <h3 className="tips-box-heading">Tips for Using the Tool</h3>
          <ul>
            <li>😊 Type your queries in the input box below.</li>
            <li>👆 Press Enter or click "Send" to submit.</li>
            <li>🤖 Use simple and clear language for better results.</li>
            <li>🗺️ Explore the Navigation menu for additional resources.</li>
          </ul>
        </div>
        <ul>
          <li>Tips</li>
          <li>About</li>
          <li>Help</li>
        </ul>
      </div>

      <div className="langflow-container">
        <h1>Social Media Analyser with LANGFLOW</h1>
        <div className="chat-window">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.type === "user" ? "user" : "bot"}`}
            >
              <div className="message-bubble">
                {message.type === "bot" ? (
                  <div dangerouslySetInnerHTML={{ __html: marked(message.text) }} />
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
          <div className="input-wrapper">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message..."
            />
            <button className="sendBtn" onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LangFlowPage;
