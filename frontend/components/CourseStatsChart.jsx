import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

/* 🔸  A bright repeating palette */
const COLORS = [
  "#FF6384", // pink-red
  "#36A2EB", // sky blue
  "#FFCE56", // yellow
  "#4BC0C0", // teal
  "#9966FF", // violet
  "#F67019", // orange
  "#00A950", // green
];

/**
 * Pie-chart: % of all enrolled students per course.
 */
const CourseStatsChart = ({ courses }) => {
  const totalStudents = courses.reduce(
    (sum, c) => sum + c.students.length,
    0
  );

  const data = courses.map((c) => ({
    name:
      c.title.length > 18 ? c.title.slice(0, 15) + "…" : c.title,
    value: c.students.length,
  }));

  return (
    <div
      style={{
        width: 450,
        maxWidth: "100%",
        margin: "0 2rem 2rem 0",
        padding: "1rem",
        border: "1px solid #ccc",
        borderRadius: "12px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        textAlign: "center",
        float: "left",
      }}
    >
      <h2 style={{ marginBottom: "0.5rem" }}>
        Student Distribution by Course
      </h2>
      <small>Total students: {totalStudents}</small>

      <ResponsiveContainer width="100%" height={320}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label
          >
            {/* 🔸 color every slice */}
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend verticalAlign="bottom" height={36} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CourseStatsChart;
