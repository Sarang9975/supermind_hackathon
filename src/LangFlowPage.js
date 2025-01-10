import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { marked } from "marked";
import "./LangFlowPage.css";
import sonetlogo from "./sonetlogo.png";
import logo from "./logo.png";
import voiceIcon from "./voiceIcon.png";
import attachIcon from "./attachIcon.png";
import { FaCopy, FaPaperclip } from "react-icons/fa";
import { IoMdAttach, IoMdMic } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";
import Analysis from "./Analysis";
import * as pdfjsLib from "pdfjs-dist"; // Import pdfjs-dist for PDF processing
import * as XLSX from "xlsx";
import * as mammoth from "mammoth";

const PROXY_URL = "https://supermind-hackathon-07fg.onrender.com/proxy";

function LangFlowPage() {
  const [userInput, setUserInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showChatBox, setShowChatBox] = useState(false);
  const [showAboutSection, setShowAboutSection] = useState(true);
  const [buttonHighlight, setButtonHighlight] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [pdfText, setPdfText] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [extractedFileText, setExtractedFileText] = useState(""); // Store extracted text
  const [isListening, setIsListening] = useState(false); // To track if the voice input is active
  const recognitionRef = useRef(null); // Reference to the SpeechRecognition instance

  useEffect(() => {
    // Check if the browser supports SpeechRecognition
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support Speech Recognition.");
    } else {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = true; // Continue listening even after a pause
      recognition.interimResults = true; // Show interim results while speaking
      recognition.lang = "en-US"; // Set the language for recognition

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserInput((prev) => prev + transcript); // Append to user input
      };

      recognition.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current = recognition; // Save the instance in a ref
    }
  }, []);

  const inputRef = useRef(null);

  const handleVoiceClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop(); // Stop listening
      } else {
        recognitionRef.current.start(); // Start listening
      }
    }
  };
  // Correct URL for PDF.js worker
  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.10.377/pdf.worker.min.js";

  const handleSubmit = async (input = userInput) => {
    if ((!input.trim() && !extractedFileText.trim()) || loading) return;
    setUserInput("");
    setUploadedFileName("");
    const userMessage = { type: "user", text: input };
    setChatHistory((prev) => [...prev, userMessage]);
    setShowChatBox(true);
    setShowAboutSection(false);

    setLoading(true);
    setButtonHighlight(false);
    try {
      const combinedInput = `${input}\n\n${extractedFileText}`.trim();
      const data = {
        input_value: combinedInput,
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
      setShowTips(true);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const handleCopy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (error) {
      console.error("Failed to copy text:", error);
    }
  };

  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  const handleInputResize = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to auto
      const scrollHeight = textarea.scrollHeight;
      const maxHeight = 150; // Match with the CSS max-height
      textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`; // Restrict height
    }
  };
  useEffect(() => {
    handleInputResize(); // Resize input on load
  }, []);

  const handleTipClick = (text) => {
    handleSubmit(text);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileExtension = file.name.split(".").pop().toLowerCase();
      setUploadedFileName(file.name);

      switch (fileExtension) {
        case "pdf":
          handlePDFUpload(file);
          break;
        case "csv":
          handleCSVUpload(file);
          break;
        case "xls":
        case "xlsx":
          handleExcelUpload(file);
          break;
        case "doc":
        case "docx":
          handleDocUpload(file);
          break;
        default:
          alert("Unsupported file type.");
          setUploadedFileName("");
      }
    }
  };

  const handlePDFUpload = (file) => {
    if (file && file.type === "application/pdf") {
      setUploadedFile(file);

      const reader = new FileReader();
      reader.onload = async () => {
        const pdfBuffer = reader.result;
        try {
          const pdf = await pdfjsLib.getDocument(pdfBuffer).promise;
          let extractedText = "";
          for (let i = 0; i < pdf.numPages; i++) {
            const page = await pdf.getPage(i + 1);
            const textContent = await page.getTextContent();
            const pageText = textContent.items
              .map((item) => item.str)
              .join(" ");
            extractedText += pageText + "\n\n";
          }
          setExtractedFileText(extractedText); // Store the extracted text
        } catch (error) {
          console.error("Error extracting PDF text:", error);
          alert("Failed to extract text from PDF.");
          setUploadedFileName("");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid PDF file.");
    }
  };

  const handleCSVUpload = (file) => {
    if (file && file.type === "text/csv") {
      const reader = new FileReader();
      reader.onload = () => {
        const csvText = reader.result;
        const rows = csvText.split("\n");
        const extractedText = rows.join("\n"); // Combine rows into a single string
        setExtractedFileText(extractedText); // Store the extracted text
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid CSV file.");
    }
  };

  const handleExcelUpload = (file) => {
    if (
      file &&
      (file.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
        file.type === "application/vnd.ms-excel")
    ) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
          header: 1,
        });
        const extractedText = sheetData
          .map((row) => row.join(", ")) // Convert rows to a CSV-like string
          .join("\n");
        setExtractedFileText(extractedText); // Store the extracted text
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid Excel file.");
    }
  };

  const handleDocUpload = (file) => {
    if (
      file &&
      (file.type === "application/msword" ||
        file.type ===
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document")
    ) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const result = await mammoth.extractRawText({
            arrayBuffer: e.target.result,
          });
          setExtractedFileText(result.value); // Store the extracted text
        } catch (error) {
          console.error("Error reading DOC/DOCX file:", error);
          alert("Failed to extract text from the document.");
          setUploadedFileName("");
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Please upload a valid DOC or DOCX file.");
    }
  };

  const removeUploadedFile = () => {
    setUploadedFileName(""); // Remove file name
    setExtractedFileText(""); // Clear extracted text
  };

  const openFileDialog = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const formatResponse = (text) => {
    // Match a simple table with pipe separators (e.g., | column1 | column2 |)
    const tableRegex = /\|(.+\|)+\n(\|(.+\|)+\n)+/g;

    // Format the table in the response if it exists
    if (tableRegex.test(text)) {
      // Replace the table part with an HTML <table> tag
      text = text.replace(tableRegex, (match) => {
        const rows = match.split("\n").map((row) => {
          const columns = row.split("|").filter((col) => col.trim() !== "");
          return `<tr>${columns
            .map((col) => `<td>${col.trim()}</td>`)
            .join("")}</tr>`;
        });
        return `<table border="1">${rows.join("")}</table>`;
      });
    }

    // Use marked to convert any markdown content into HTML
    return marked(text);
  };

  const navigate = useNavigate();

  const handleNavigateToHome = (sectionId) => {
    navigate("/", { state: { sectionId } });
  };
  return (
    <>
    
  <header className="chat-navbar">
    <div className="chat-navbar-left">
      <img
        src={logo}
        alt="Logo"
        className="chat-navbar-logo-img"
        onClick={() => handleNavigateToHome("home-section")}
        style={{ cursor: "pointer" }}
      />
    </div>
    <nav className="chat-navbar-links">
      <a onClick={() => handleNavigateToHome("home-section")}>Home</a>
      <a onClick={() => handleNavigateToHome("about-section")}>About</a>
      <a href="/chat">Analyse</a>
      <a href="/dashboard">Dashboard</a>
      <a onClick={() => handleNavigateToHome("contact-section")}>Contact Us</a>
    </nav>
  </header>



      <div className="chatpage-main-container">
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

        <div className="chat-container">
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
                  dynamics. <br /> Ask anything, and let Sonnet reveal the story
                  behind the stats!
                </p>
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
                            __html: marked(formatResponse(message.text)), // Apply table formatting
                          }}
                          style={{ flex: 1 }}
                        />
                        <button
                          style={{
                            position: "absolute",
                            margin: "5px",
                            top: "5px",
                            right: "8px",
                            background: "transparent",
                            border: "none",
                            cursor: "pointer",
                          }}
                          onClick={() => handleCopy(message.text)}
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
            <textarea
              ref={inputRef}
              value={userInput}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              placeholder="Ask whatever you want..."
              className="input-box"
              rows={1}
              onInput={handleInputResize}
              style={{ overflowY: "auto" }}
            />
            <input
              type="file"
              ref={inputRef}
              onChange={handleFileUpload}
              style={{ display: "none" }}
              accept=".pdf,.csv,.xls,.xlsx,.doc,.docx"
            />
            <div className="buttons-container">
              <div className="left-buttons">
                <button
                  className={`voice-button ${
                    isListening ? "active-voice" : ""
                  }`}
                  onClick={handleVoiceClick}
                >
                  <img src={voiceIcon} className="iconsStyling" />
                  <span className="tooltip">Voice Input</span>
                </button>
                <button className="attachment-button" onClick={openFileDialog}>
                  <img src={attachIcon} className="iconsStyling" />
                  <span className="tooltip">Attach Documents</span>
                </button>
                <div className="analysis-button">
                  <Analysis />
                  <span className="tooltip">Download Report</span>
                </div>
              </div>
              {uploadedFileName && (
                <div className="uploaded-file-display">
                  <div className="file-info">
                    <span>{uploadedFileName}</span>
                    <button
                      onClick={removeUploadedFile}
                      className="remove-file-button"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
              <div className="send-button-container">
                <button
                  onClick={() => handleSubmit(userInput)}
                  disabled={loading}
                  className="send-button"
                >
                  {loading ? <div className="loader"></div> : <HiArrowRight />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  
  );
}

export default LangFlowPage;

