import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Chart } from "chart.js/auto";

const Analysis = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/api/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        return response.json();
      })
      .then((data) => {
        if (data.success) {
          setData(data.data);
        } else {
          setError(data.error);
        }
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);

  const generateChartImage = async (chartData, chartType, title) => {
    return new Promise((resolve) => {
      const chartCanvas = document.createElement("canvas");
      const chartInstance = new Chart(chartCanvas, {
        type: chartType,
        data: chartData,
        options: {
          responsive: false, // Disable responsiveness for consistent rendering
          animation: {
            onComplete: () => {
              resolve(chartCanvas.toDataURL("image/png"));
            },
          },
          plugins: {
            title: {
              display: true,
              text: title,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    });
  };

  const generatePDF = async () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(16);
    doc.text("Social Media Engagement Report", 10, 10);

    // Generate Chart 1: Post Types and Views
    const postTypes = Array.from(new Set(data.map((item) => item.post_type)));
    const viewsByType = postTypes.map((type) =>
      data
        .filter((item) => item.post_type === type)
        .reduce((sum, item) => sum + item.views, 0)
    );

    const chartData1 = {
      labels: postTypes,
      datasets: [
        {
          label: "Views",
          data: viewsByType,
          backgroundColor: "rgba(54, 162, 235, 0.2)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
    const chartImage1 = await generateChartImage(
      chartData1,
      "bar",
      "Views by Post Type"
    );

    // Add Chart 1 to PDF
    doc.addImage(chartImage1, "PNG", 10, 30, 180, 90);

    // Generate Chart 2: Themes and Engagement
    const themes = Array.from(new Set(data.map((item) => item.theme)));
    const likesByTheme = themes.map((theme) =>
      data
        .filter((item) => item.theme === theme)
        .reduce((sum, item) => sum + item.likes, 0)
    );

    const chartData2 = {
      labels: themes,
      datasets: [
        {
          label: "Likes",
          data: likesByTheme,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
        },
      ],
    };
    const chartImage2 = await generateChartImage(
      chartData2,
      "pie",
      "Likes by Theme"
    );

    // Add Chart 2 to PDF
    doc.addImage(chartImage2, "PNG", 10, 140, 180, 90);

    // Generate Chart 3: Engagement Overview
    const engagements = data.map((item) => ({
      label: item.post_id,
      value: item.likes + item.shares + item.views,
    }));
    const chartData3 = {
      labels: engagements.map((e) => e.label),
      datasets: [
        {
          label: "Engagement",
          data: engagements.map((e) => e.value),
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
    const chartImage3 = await generateChartImage(
      chartData3,
      "line",
      "Engagement by Post"
    );

    // Add Chart 3 to PDF (new page)
    doc.addPage();
    doc.addImage(chartImage3, "PNG", 10, 30, 180, 90);

    // Save the PDF
    doc.save("Social_Media_Engagement_Report.pdf");
  };

  return (
    <div>
      {/* <h1>Data from Astra DB</h1>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <ul>
        {data.map((item, index) => (
          <li key={index}>{JSON.stringify(item)}</li>
        ))}
      </ul> */}

      {/* Button to trigger PDF generation */}
      <button
        onClick={generatePDF}
        style={{
          background: "none",
          border: "none",
          color: "white",
          textDecoration: "underline",
          cursor: "pointer",
          fontSize: "16px",
        }}
      >
        Download Report
      </button>
    </div>
  );
};

export default Analysis;
