import React from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const TeacherContributionChart = ({ courses }) => {
  // Aggregate data: count the number of courses per teacher
  const teacherCourseCounts = courses.reduce((acc, course) => {
    const teacherName = course.teacher?.full_name || "Unknown Teacher";
    acc[teacherName] = (acc[teacherName] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(teacherCourseCounts); // Teacher names
  const dataValues = Object.values(teacherCourseCounts); // Number of courses per teacher

  const data = {
    labels,
    datasets: [
      {
        label: "Number of Courses",
        data: dataValues,
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow custom height and width
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Teacher Contribution to Courses",
      },
    },
  };

  return (
    <div
      style={{
        width: "80%", // Increase width to 80% of the parent container
        height: "450px", // Increase height to 500px
        margin: "0 auto", // Center the chart horizontally
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        textAlign: "center",
      }}
    >
      <Pie data={data} options={options} />
    </div>
  );
};

export default TeacherContributionChart;