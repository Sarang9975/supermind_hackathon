import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import "./LangFlowPage.css";

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
        <h2>Navigation</h2>
        <ul>
          <li>Tips</li>
          <li>About</li>
          <li>Help</li>
        </ul>
      </div>

      <div className="langflow-container">
        <h1>Social Media Analytics using LANGFLOW 𐤕 DATASTRAX</h1>
        <div className="chat-window">
          {chatHistory.map((message, index) => (
            <div
              key={index}
              className={`chat-message ${message.type === "user" ? "user" : "bot"}`}
            >
              <div className="message-bubble">{message.type === "bot" ? (
                <div dangerouslySetInnerHTML={{ __html: marked(message.text) }} />
              ) : (
                message.text
              )}</div>
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
            <button onClick={handleSubmit}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LangFlowPage;

