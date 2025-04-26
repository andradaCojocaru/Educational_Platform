// src/views/dashboard/Dashboard.jsx
import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell,
  LineChart, Line
} from "recharts";
import useAxios from "../../utils/useAxios";

export default function Dashboard() {
  const api   = useAxios();      // your custom axios with JWT + refresh
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/stats/").then(res => setData(res.data));
  }, []);

  if (!data) return <p className="p-6">Loading…</p>;

  const catData = data.courses_per_category
      .map(d => ({ name: d.category, value: d.total }));

  const roleData = data.role_distribution
      .map(d => ({ name: d.role, value: d.total }));

  const monthData = data.enrollments_per_month
      .map(d => ({ month: d.enrolled__month, value: d.total }));

  return (
    <div className="grid gap-8 p-6 md:grid-cols-3">
      {/* 1. Courses per category */}
      <BarChart width={300} height={240} data={catData}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="value" />
      </BarChart>

      {/* 2. Role distribution */}
      <PieChart width={300} height={240}>
        <Pie data={roleData} dataKey="value" outerRadius={80} label>
          {roleData.map((_, idx) => <Cell key={idx} />)}
        </Pie>
        <Tooltip />
      </PieChart>

      {/* 3. Enrollments / month */}
      <LineChart width={300} height={240} data={monthData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Line dataKey="value" strokeWidth={2} />
      </LineChart>
    </div>
  );
}
