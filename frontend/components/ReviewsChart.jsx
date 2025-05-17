import React from "react";
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

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const ReviewsChart = ({ courses }) => {
  // Prepare data for the chart
  const labels = courses.map((course) => course.title); // Course titles
  const ratings = courses.map((course) => course.average_rating || 0); // Average ratings

  const data = {
    labels,
    datasets: [
      {
        label: "Average Ratings",
        data: ratings,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Average Ratings for Courses",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default ReviewsChart;