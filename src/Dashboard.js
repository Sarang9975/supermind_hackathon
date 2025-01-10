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
import { useNavigate } from "react-router-dom";

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
  RadialLinearScale
);

function Dashboard() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [tableCollapsed, setTableCollapsed] = useState(true);
  const [maxRows, setMaxRows] = useState(5); // Initially show 5 rows

  const navigate = useNavigate();

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
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://python-server-h4xw.onrender.com/api/data");
        const result = await response.json();

        if (result.success) {
          setData(result.data);
          setFilteredData(result.data);
        } else {
          setError(result.error || "Failed to fetch data");
        }
      } catch (err) {
        setError("Error connecting to server: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (filter === "all") {
      setFilteredData(data);
    } else {
      setFilteredData(
        data.filter(
          (item) => item.post_type.toLowerCase() === filter.toLowerCase()
        )
      );
    }
  }, [filter, data]);

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="loading-spinner"></div>
          <h2>Loading Dashboard...</h2>
          <p>Please wait while we fetch your data</p>
        </div>
      </div>
    );
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

  // Calculate post type distribution
  const postTypeCount = data.reduce((acc, item) => {
    acc[item.post_type] = (acc[item.post_type] || 0) + 1;
    return acc;
  }, {});

  // Calculate theme distribution
  const themeCount = data.reduce((acc, item) => {
    acc[item.theme] = (acc[item.theme] || 0) + 1;
    return acc;
  }, {});

  // Chart data for post distribution
  const barChartData = {
    labels: Object.keys(postTypeCount),
    datasets: [
      {
        label: "Number of Posts",
        data: Object.values(postTypeCount),
        backgroundColor: [
          "rgba(6, 182, 212, 0.7)", // Cyan
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(79, 70, 229, 0.7)", // Indigo
          "rgba(236, 72, 153, 0.7)", // Pink
          "rgba(34, 197, 94, 0.7)", // Green
        ],
        borderColor: [
          "rgba(6, 182, 212, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(79, 70, 229, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(34, 197, 94, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  


  // Chart data for theme distribution
  const pieChartData = {
    labels: Object.keys(themeCount),
    datasets: [
      {
        data: Object.values(themeCount),
        backgroundColor: [
          "rgba(236, 72, 153, 0.7)", // Pink
          "rgba(168, 85, 247, 0.7)", // Purple
          "rgba(59, 130, 246, 0.7)", // Blue
          "rgba(34, 197, 94, 0.7)", // Green
          "rgba(234, 179, 8, 0.7)", // Yellow
        ],
        borderColor: [
          "rgba(236, 72, 153, 1)",
          "rgba(168, 85, 247, 1)",
          "rgba(59, 130, 246, 1)",
          "rgba(34, 197, 94, 1)",
          "rgba(234, 179, 8, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          color: "#e0e0e0",
          font: {
            size: 11,
          },
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Post Type Distribution",
        color: "#e0e0e0",
        font: {
          size: 14,
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 10,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#e0e0e0",
          font: {
            size: 10,
          },
        },
      },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: "#e0e0e0",
          font: {
            size: 11,
          },
          padding: 10,
        },
      },
      title: {
        display: true,
        text: "Content Theme Distribution",
        color: "#e0e0e0",
        font: {
          size: 14,
          weight: "bold",
        },
        padding: {
          top: 5,
          bottom: 10,
        },
      },
    },
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

  const lineOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Likes Trend",
      },
    },
  };

  const radarChartData = {
    labels: [
      "Likes",
      "Views",
      "Shares",
      "Comments",
      "Saves",
      "Engagement Rate",
    ],
    datasets: [
      {
        label: "Current Period",
        data: [65, 85, 45, 55, 70, 75],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "Previous Period",
        data: [55, 75, 35, 45, 60, 65],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Engagement Metrics",
      },
    },
  };

  


  const heatmapData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "00-04",
        data: [65, 45, 35, 55, 70, 35, 25],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
      {
        label: "04-08",
        data: [55, 65, 45, 65, 60, 45, 35],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "08-12",
        data: [75, 85, 75, 85, 80, 55, 45],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
      {
        label: "12-16",
        data: [85, 95, 85, 95, 90, 75, 65],
        backgroundColor: "rgba(255, 206, 86, 0.2)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "16-20",
        data: [95, 85, 95, 85, 85, 85, 75],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "20-24",
        data: [75, 65, 75, 65, 75, 65, 55],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const heatmapOptions = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: "easeInOutQuart",
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Activity Heatmap",
      },
    },
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-navbar">
        <div className="dashboard-navbar-left">
          <img
                  src={logo}
                  alt="Logo"
                  className="dashboard-navbar-logo-img"
                  onClick={() => handleNavigateToHome("home-section")}
                  style={{ cursor: "pointer" }}
                />
        </div>
        <nav className="dashboard-navbar-links">
          <a href="/">Home</a>
          <a
  href="#about-section"
  onClick={(e) => {
    e.preventDefault();
    handleNavigateToHome("about-section");
  }}
>
  About
</a>
          <a href="/chat">Analyse</a>
          <a href="/dashboard">Dashboard</a>
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
            <h4 style={{paddingBottom:"5px"}}>Filter by Post Type: </h4>
          <div className="filter">
            <select
              id="post-type"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="static_image">Image</option>
              <option value="carousel">Carousel</option>
              <option value="reels">Reels</option>
              <option value="live_video">Video</option>
              <option value="text">Text</option>
              <option value="meme">Meme</option>
              <option value="giveaway">Giveaway</option>
              <option value="poll">Poll</option>
              <option value="story">Story</option>
              <option value="event_promotion">Event Promotion</option>
              <option value="infographic">Infographic</option>
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
                {filteredData
                  .slice(0, tableCollapsed ? maxRows : filteredData.length)
                  .map((item) => (
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
          <button
              className="show-more-button"
              onClick={() => setTableCollapsed(!tableCollapsed)}
            >
              {tableCollapsed ? "Show More" : "Show Less"}
            </button>
        </div>

        {/* Charts Section */}
        {/* Charts Section */}
        <div
          className="charts-container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "20px",
            justifyContent: "space-around",
            marginTop: "20px",
          }}
        >
          {/* Post Distribution Chart */}
          <div
            style={{
              height: "380px",
              width: "45%",
              position: "relative",
              background: "rgba(17, 25, 40, 0.75)",
              backdropFilter: "blur(12px)",
              padding: "25px",
              borderRadius: "12px",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Post Type Distribution</h3>
            <Bar data={barChartData} options={barOptions} />
          </div>

          {/* Theme Distribution Chart */}
          <div
            style={{
              height: "380px",
              width: "45%",
              position: "relative",
              background: "rgba(17, 25, 40, 0.75)",
              backdropFilter: "blur(12px)",
              padding: "25px",
              borderRadius: "12px",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Content Theme Distribution</h3>
            <Pie data={pieChartData} options={pieOptions} />
          </div>
        </div>

        <div className="chart-container" style={{ marginTop: "20px" }}>
          <div
            style={{
              height: "380px",
              width: "100%",
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              background: "rgba(17, 25, 40, 0.75)",
              backdropFilter: "blur(12px)",
              padding: "25px",
              borderRadius: "12px",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              marginBottom: "20px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Engagement Metrics</h3>
            <Radar data={radarChartData} options={radarOptions} />
          </div>
          <div
            className="chart chart-small"
            style={{
              height: "380px",
              width: "25%",
              position: "relative",
              marginLeft: "auto",
              marginRight: "auto",
              backdropFilter: "blur(12px)",
              padding: "25px",
              borderRadius: "12px",
              border: "2px solid rgba(255, 255, 255, 0.9)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              overflow: "auto",
            }}
          >
            <h3 style={{ marginBottom: "15px" }}>Activity Heatmap</h3>
            <Bar data={heatmapData} options={heatmapOptions} />
          </div>
        </div>

        <div
          style={{
            height: "380px",
            width: "80%",
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop: "25px",
            background: "rgba(17, 25, 40, 0.75)",
            backdropFilter: "blur(12px)",
            padding: "20px 25px",
            borderRadius: "12px",
            border: "2px solid rgba(255, 255, 255, 0.9)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            overflow: "auto",
          }}
        >
          <h3 style={{ marginBottom: "15px" }}>Likes Over Time</h3>
          <Line data={lineChartData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
