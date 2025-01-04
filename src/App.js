import React, { useState } from "react";
import axios from "axios";
import { marked } from "marked";
import ClipLoader from "react-spinners/ClipLoader";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "./App.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PROXY_URL = "http://localhost:3001/proxy";

function LangFlowPage() {
  const [userInput, setUserInput] = useState("");
  const [apiResponse, setApiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [chartData, setChartData] = useState(null);

  const handleSubmit = async () => {
    setLoading(true);
    setShowChart(false);
    setChartData(null);
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
      setApiResponse(text);

      console.log("Raw API Response:", text);

      // Parse data for dynamic chart
      const parsedData = parseChartData(text);
      console.log("Parsed Chart Data:", parsedData);

      if (parsedData) {
        setChartData(parsedData);
        setShowChart(true);
      }
    } catch (error) {
      console.error("Error:", error);
      setApiResponse("Error: Failed to get response from the proxy server.");
    } finally {
      setLoading(false);
    }
  };

  const parseChartData = (responseText) => {
    try {
      console.log("Raw Response Text:", responseText); // Debug log
  
      // Match "Average Engagement for <Type>" sections
      const matches = responseText.match(/Average Engagement for (.+?):([\s\S]*?)(?=Average Engagement for|Summary of Comparison|$)/g);
  
      if (!matches || matches.length === 0) {
        throw new Error("No 'Average Engagement' sections found in the response text.");
      }
  
      const metrics = {};
  
      matches.forEach((section) => {
        // Extract the post type (e.g., Reels, Carousels)
        const postTypeMatch = section.match(/Average Engagement for (.+?):/);
        const postType = postTypeMatch ? postTypeMatch[1].trim() : null;
  
        if (!postType) {
          throw new Error("Failed to extract post type.");
        }
  
        // Extract metrics (e.g., Likes, Shares, etc.)
        const metricMatches = Array.from(section.matchAll(/-\s*([\w\s]+):\s*([\d.]+)/g));
  
        if (!metricMatches.length) {
          throw new Error(`No metrics found for post type: ${postType}`);
        }
  
        metrics[postType] = {};
        metricMatches.forEach(([_, metric, value]) => {
          console.log(`Post Type: ${postType}, Metric: ${metric}, Value: ${value}`); // Debug log
          metrics[postType][metric.toLowerCase()] = parseFloat(value);
        });
      });
  
      // Build labels and datasets dynamically
      const labels = Object.keys(metrics[Object.keys(metrics)[0]] || {});
      const datasets = Object.keys(metrics).map((postType) => ({
        label: postType,
        data: labels.map((label) => metrics[postType][label] || 0),
        backgroundColor: getRandomColor(),
        borderColor: getRandomColor(),
        borderWidth: 1,
      }));
  
      console.log("Parsed Chart Data:", { labels, datasets }); // Debug log
  
      return { labels, datasets };
    } catch (error) {
      console.error("Error parsing chart data:", error);
      return null;
    }
  };
  
  

  const getRandomColor = () => {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgba(${r}, ${g}, ${b}, 0.5)`;
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      title: { display: true, text: "Dynamic Engagement Insights" },
    },
  };

  return (
    <div className="langflow-container">
      <h1>LangFlow Integration</h1>
      <div className="input-group">
        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="What do you want to know?"
        />
        <button onClick={handleSubmit}>Send</button>
      </div>
      <div className="response-container">
        <h3>Response:</h3>
        {loading ? (
          <div className="loader-container">
            <ClipLoader size={50} color={"#3498db"} loading={loading} />
          </div>
        ) : (
          <div
            dangerouslySetInnerHTML={{
              __html: marked(apiResponse),
            }}
          />
        )}
      </div>
      {showChart && chartData && (
        <div className="chart-container">
          <h3>Engagement Insights</h3>
          <Bar data={chartData} options={chartOptions} />
        </div>
      )}
    </div>
  );
}

export default LangFlowPage;
