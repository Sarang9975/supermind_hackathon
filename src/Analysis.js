import React, { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import Plotly from "plotly.js-dist-min";
import downloadIcon from "./downloadIcon.png";

const Analysis = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://python-server-h4xw.onrender.com/api/data")
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

  const generateChartImage = async (chartData, chartLayout) => {
    return Plotly.toImage({
      data: chartData,
      layout: chartLayout,
      format: "png",
      width: 800,
      height: 600,
    });
  };

  const generateInsights = (data) => {
    const totalPosts = data.length;
    const totalViews = data.reduce((sum, item) => sum + item.views, 0);
    const totalLikes = data.reduce((sum, item) => sum + item.likes, 0);
    const totalShares = data.reduce((sum, item) => sum + item.shares, 0);

    const mostPopularPostType = data.reduce((acc, item) => {
      acc[item.post_type] = (acc[item.post_type] || 0) + item.views;
      return acc;
    }, {});

    const topTheme = data.reduce((acc, item) => {
      acc[item.theme] = (acc[item.theme] || 0) + item.likes;
      return acc;
    }, {});

    const topPostType = Object.keys(mostPopularPostType).reduce((a, b) =>
      mostPopularPostType[a] > mostPopularPostType[b] ? a : b
    );

    const topThemeCategory = Object.keys(topTheme).reduce((a, b) =>
      topTheme[a] > topTheme[b] ? a : b
    );

    return {
      totalPosts,
      totalViews,
      totalLikes,
      totalShares,
      topPostType,
      topThemeCategory,
    };
  };

  const generatePDF = async () => {
    const doc = new jsPDF("portrait", "mm", "a4");

    const addPageBorder = () => {
      doc.setDrawColor(150);
      doc.setLineWidth(0.5);
      doc.rect(5, 5, 200, 287, "S");
    };

    addPageBorder();

    const date = new Date().toLocaleString();
    const pageWidth = doc.internal.pageSize.getWidth();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Social Media Engagement Report", pageWidth / 2, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${date}`, pageWidth / 2, 28, { align: "center" });

    doc.setDrawColor(200);
    doc.line(10, 35, pageWidth - 10, 35);

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Key Insights", 10, 45);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    const insights = generateInsights(data);
    doc.text(
      `Total Posts Analyzed: ${insights.totalPosts}\nTotal Views: ${insights.totalViews}\nTotal Likes: ${insights.totalLikes}\nTotal Shares: ${insights.totalShares}\nMost Popular Post Type: ${insights.topPostType}\nTop Theme Category: ${insights.topThemeCategory}`,
      15,
      55
    );

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Recommendations", 10, 100);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(
      "1. Focus more on creating content around the top theme category to drive engagement.\n" +
        "2. Utilize the most popular post type format to maximize reach.\n" +
        "3. Analyze less-engaging themes to improve future posts.",
      15,
      110
    );

    const charts = [];

    // Chart 1: Views by Post Type
    const chart1Data = [
      {
        x: Array.from(new Set(data.map((item) => item.post_type))),
        y: Array.from(new Set(data.map((item) => item.post_type))).map((type) =>
          data
            .filter((item) => item.post_type === type)
            .reduce((sum, item) => sum + item.views, 0)
        ),
        type: "bar",
        marker: { color: "rgba(54, 162, 235, 0.7)" },
      },
    ];
    const chart1Layout = {
      title: "Views by Post Type",
      xaxis: { title: "Post Type" },
      yaxis: { title: "Views" },
    };
    charts.push(generateChartImage(chart1Data, chart1Layout));

    // Chart 2: Post Type Distribution
    const chart2Data = [
      {
        labels: Array.from(new Set(data.map((item) => item.post_type))),
        values: Array.from(new Set(data.map((item) => item.post_type))).map((type) =>
          data.filter((item) => item.post_type === type).length
        ),
        type: "pie",
      },
    ];
    const chart2Layout = { title: "Post Type Distribution" };
    charts.push(generateChartImage(chart2Data, chart2Layout));

    // Chart 3: Likes Over Time
    const dateMap = data.reduce((acc, item) => {
      if (!item.date) return acc;
      acc[item.date] = (acc[item.date] || 0) + item.likes;
      return acc;
    }, {});
    const dates = Object.keys(dateMap).sort();
    const likesOverTime = dates.map((date) => dateMap[date]);

    const chart3Data = [
      {
        x: dates,
        y: likesOverTime,
        type: "scatter",
        mode: "lines+markers",
        line: { color: "rgba(255, 99, 132, 0.7)" },
      },
    ];
    const chart3Layout = {
      title: "Likes Over Time",
      xaxis: { title: "Date" },
      yaxis: { title: "Likes" },
    };
    charts.push(generateChartImage(chart3Data, chart3Layout));

    // Chart 4: Engagement Comparison
    const engagementMetrics = ["Views", "Likes", "Shares"];
    const engagementValues = [
      data.reduce((sum, item) => sum + item.views, 0),
      data.reduce((sum, item) => sum + item.likes, 0),
      data.reduce((sum, item) => sum + item.shares, 0),
    ];
    const chart4Data = [
      {
        type: "scatterpolar",
        r: engagementValues,
        theta: engagementMetrics,
        fill: "toself",
        marker: { color: "rgba(75, 192, 192, 0.7)" },
      },
    ];
    const chart4Layout = {
      polar: { radialaxis: { visible: true } },
      title: "Engagement Metrics Comparison",
    };
    charts.push(generateChartImage(chart4Data, chart4Layout));

    // Chart 5: Shares by Theme
    const chart5Data = [
      {
        x: Array.from(new Set(data.map((item) => item.theme))),
        y: Array.from(new Set(data.map((item) => item.theme))).map((theme) =>
          data
            .filter((item) => item.theme === theme)
            .reduce((sum, item) => sum + item.shares, 0)
        ),
        type: "bar",
        marker: { color: "rgba(153, 102, 255, 0.7)" },
      },
    ];
    const chart5Layout = {
      title: "Shares by Theme",
      xaxis: { title: "Theme" },
      yaxis: { title: "Shares" },
    };
    charts.push(generateChartImage(chart5Data, chart5Layout));

    const chartImages = await Promise.all(charts);

    let yOffset = 130;
    chartImages.forEach((chart, index) => {
      if (yOffset + 90 > 287) {
        doc.addPage();
        addPageBorder();
        yOffset = 20;
      }
      doc.addImage(chart, "PNG", 10, yOffset, 180, 90);
      yOffset += 100;
    });

    doc.save("Social_Media_Engagement_Report.pdf");
  };

  return (
    <div>
      <img
        src={downloadIcon}
        className="iconsStyling"
        onClick={generatePDF}
        style={{
          fontSize: "1.7rem",
          color: "#6a6a6a",
          cursor: "pointer",
          position: "relative",
          background: "transparent",
          border: "none",
        }}
        onMouseOver={(e) => (e.currentTarget.style.color = "white")}
        onMouseOut={(e) => (e.currentTarget.style.color = "#6a6a6a")}
      />
    </div>
  );
};

export default Analysis;
