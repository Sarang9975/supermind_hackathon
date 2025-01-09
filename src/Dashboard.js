import React, { useState, useEffect } from "react";
import { Bar, Pie, Line, Radar, Heatmap } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
} from "chart.js";
import { FaThumbsUp, FaEye, FaShare, FaComments } from "react-icons/fa";
import "./Dashboard.css"; // Custom CSS for styling
import logo from "./logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
  ArcElement,
  RadialLinearScale,
);

function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const [typewriterText, setTypewriterText] = useState('');
  const phrases = [
    'Get Real Time Insights',
    'Monitor Performance Metrics',
    'Track Engagement Analytics',
    'Analyze User Behavior',
    'Optimize Content Strategy',
    'Discover Trending Patterns',
    'Measure Growth Impact',
    'Identify Key Metrics'
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setTypewriterText(prev => prev.slice(0, -1));
        if (typewriterText.length === 1) {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }
      }, 50);
    } else {
      timer = setTimeout(() => {
        setTypewriterText(currentPhrase.slice(0, typewriterText.length + 1));
        if (typewriterText.length === currentPhrase.length) {
          setTimeout(() => setIsDeleting(true), 1500);
        }
      }, 100);
    }

    return () => clearTimeout(timer);
  }, [typewriterText, isDeleting, phraseIndex, phrases]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/data');
        const result = await response.json();
        
        if (result.success) {
          setData(result.data);
          setFilteredData(result.data);
        } else {
          setError(result.error || 'Failed to fetch data');
        }
      } catch (err) {
        setError('Error connecting to server: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    // Filter data based on selected filter
    if (filter === "all") {
      setFilteredData(data);
    } else {
      setFilteredData(data.filter((item) => item.post_type === filter));
    }
  }, [filter, data]);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (loading) {
    return <div className="loading-message">Loading...</div>;
  }

  if (!data.length) {
    return <div className="loading-message">No data available...</div>;
  }

  // Extract metrics from the data
  const totalLikes = data.reduce((acc, item) => acc + item.likes, 0);
  const totalViews = data.reduce((acc, item) => acc + item.views, 0);
  const totalShares = data.reduce((acc, item) => acc + item.shares, 0);
  const totalComments = data.reduce(
    (acc, item) => acc + Object.keys(item.comments).length,
    0
  );

  const postTypes = data.reduce((acc, item) => {
    acc[item.post_type] = (acc[item.post_type] || 0) + 1;
    return acc;
  }, {});

  const themes = data.reduce((acc, item) => {
    acc[item.theme] = (acc[item.theme] || 0) + 1;
    return acc;
  }, {});

  // Chart data
  const barChartData = {
    labels: ["Image", "Video", "Article"],
    datasets: [
      {
        label: "Number of Posts",
        data: [
          filteredData.filter((item) => item.post_type === "Image").length,
          filteredData.filter((item) => item.post_type === "Video").length,
          filteredData.filter((item) => item.post_type === "Article").length,
        ],
        backgroundColor: [
          "rgba(6, 182, 212, 0.7)", // Cyan
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(79, 70, 229, 0.7)", // Indigo
        ],
        borderColor: [
          "rgba(6, 182, 212, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(79, 70, 229, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Technology", "Education", "Business"],
    datasets: [
      {
        data: [
          filteredData.filter((item) => item.theme === "Technology").length,
          filteredData.filter((item) => item.theme === "Education").length,
          filteredData.filter((item) => item.theme === "Business").length,
        ],
        backgroundColor: [
          "rgba(6, 182, 212, 0.7)", // Cyan
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(79, 70, 229, 0.7)", // Indigo
        ],
        borderColor: [
          "rgba(6, 182, 212, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(79, 70, 229, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const lineChartData = {
    labels: filteredData.map((item) => item.post_id),
    datasets: [
      {
        label: "Likes",
        data: filteredData.map((item) => item.likes),
        borderColor: "rgba(6, 182, 212, 0.8)",
        backgroundColor: "rgba(6, 182, 212, 0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const radarChartData = {
    labels: ['Likes', 'Views', 'Shares', 'Comments', 'Saves', 'Engagement Rate'],
    datasets: [
      {
        label: 'Current Period',
        data: [65, 85, 45, 55, 70, 75],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Previous Period',
        data: [55, 75, 35, 45, 60, 65],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  const heatmapData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: '00-04',
        data: [65, 45, 35, 55, 70, 35, 25],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: '04-08',
        data: [55, 65, 45, 65, 60, 45, 35],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: '08-12',
        data: [75, 85, 75, 85, 80, 55, 45],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: '12-16',
        data: [85, 95, 85, 95, 90, 75, 65],
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
        borderColor: 'rgba(255, 206, 86, 1)',
        borderWidth: 1,
      },
      {
        label: '16-20',
        data: [95, 85, 95, 85, 85, 85, 75],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: '20-24',
        data: [75, 65, 75, 65, 75, 65, 55],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e0e0e0",
          font: {
            size: 12,
          },
          padding: 20,
        },
      },
    },
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#e0e0e0",
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.05)",
        },
        ticks: {
          color: "#e0e0e0",
        },
      },
    },
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar">
        <div className="dashboard-navbar-left">
          <img src={logo} alt="Logo" className="dashboard-navbar-logo-img" />
        </div>
        <nav className="dashboard-navbar-links">
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/chat">Analyse</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/">Contact Us</a>
        </nav>
      </header>
      <div className="dashboard-main-container">
        <h1 className="dashboard-title">Dashboard</h1>
        <hr className="dashboard-title-line" />

        {/* Insights Section */}
        <div className="insights">
          <div className="insight-card">
            <FaThumbsUp className="icon" />
            <h3>{totalLikes}</h3>
            <p className="tiles-info">Total Likes</p>
          </div>
          <div className="insight-card">
            <FaEye className="icon" />
            <h3>{totalViews}</h3>
            <p className="tiles-info">Total Views</p>
          </div>
          <div className="insight-card">
            <FaShare className="icon" />
            <h3>{totalShares}</h3>
            <p className="tiles-info">Total Shares</p>
          </div>
          <div className="insight-card">
            <FaComments className="icon" />
            <h3>{totalComments}</h3>
            <p className="tiles-info">Total Comments</p>
          </div>
        </div>

        {/* Filter and Table Section */}
        <div className="filter-table-section">
          <div className="filter">
            <label htmlFor="post-type">Filter by Post Type: </label>
            <select
              id="post-type"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="Image">Image</option>
              <option value="Video">Video</option>
              <option value="Article">Article</option>
            </select>
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Post ID</th>
                  <th>Type</th>
                  <th>Theme</th>
                  <th>Views</th>
                  <th>Likes</th>
                  <th>Comments</th>
                  <th>Shares</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item) => (
                  <tr key={item.post_id}>
                    <td>{item.post_id}</td>
                    <td>{item.post_type}</td>
                    <td>{item.theme}</td>
                    <td>{item.views}</td>
                    <td>{item.likes}</td>
                    <td>{Object.keys(item.comments).length}</td>
                    <td>{item.shares}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts">
          <div className="chart-container">
            <div
              className="chart chart-small"
              style={{
                height: "380px",
                width: "45%",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <h3>Post Type Distribution</h3>
              <Bar data={barChartData} options={chartOptions} />
            </div>
            <div
              className="chart chart-small"
              style={{
                height: "380px",
                width: "45%",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <h3>Theme Distribution</h3>
              <Pie data={pieChartData} options={chartOptions} />
            </div>
          </div>

          {/* Typewriter Effect */}
          <div className="typewriter-container">
            <div className="typewriter">
              {typewriterText}
            </div>
          </div>
          
          <div className="chart-container">
            <div
              className="chart chart-small"
              style={{
                height: "380px",
                width: "45%",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <h3>Engagement Metrics</h3>
              <Radar 
                data={radarChartData} 
                options={{
                  ...chartOptions,
                  scales: {
                    r: {
                      ticks: { color: '#e0e0e0' },
                      grid: { color: 'rgba(255, 255, 255, 0.1)' },
                      angleLines: { color: 'rgba(255, 255, 255, 0.1)' },
                      pointLabels: { color: '#e0e0e0' }
                    }
                  }
                }} 
              />
            </div>
            <div
              className="chart chart-small"
              style={{
                height: "380px",
                width: "45%",
                position: "relative",
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              <h3>Activity Heatmap</h3>
              <Bar 
                data={heatmapData} 
                options={{
                  ...chartOptions,
                  scales: {
                    x: {
                      stacked: true,
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#e0e0e0' }
                    },
                    y: {
                      stacked: true,
                      grid: { color: 'rgba(255, 255, 255, 0.05)' },
                      ticks: { color: '#e0e0e0' }
                    }
                  }
                }} 
              />
            </div>
          </div>

          <div
            className="chart chart-large"
            style={{
              height: "380px",
              width: "85%",
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto"
            }}
          >
            <h3>Likes Over Time</h3>
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;