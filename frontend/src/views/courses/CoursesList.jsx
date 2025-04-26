import { useEffect, useState } from "react";
import useAxios from "../../utils/useAxios";
import { useAuthStore } from "../../store/auth";
import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

export default function CoursesList() {
  const api       = useAxios();
  const role = useAuthStore(s => s.getUser().role);
  const [items, setItems] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // pick endpoint based on role
    const endpoint = role === "student"
      ? "/enrollments/"     // returns [{ id, course: { … } }, …]
      : "/courses/";        // returns [{ id, title, … }, …]

    api.get(endpoint)
      .then(res => {
        // if enrollments, pluck course out
        const data = role === "student"
          ? res.data.map(e => e.course)
          : res.data;
        setItems(data);
      })
      .catch(e => setError(e.response?.data.detail || e.message));
  }, [role]);

  return (
    <>
      <BaseHeader />
      <main className="container mx-auto p-6">
        <h1 className="text-2xl mb-4">My Courses</h1>

        {error && <p className="text-red-600">{error}</p>}
        {!items && !error && <p>Loading…</p>}
        {items?.length === 0 && <p>You’re not enrolled in any courses yet.</p>}

        <ul className="space-y-4">
          {items?.map(c => (
            <li key={c.id} className="border p-4 rounded">
              <h2 className="text-xl font-semibold">{c.title}</h2>
              <p className="text-gray-600">{c.category}</p>
              <p className="mt-2">{c.description}</p>
              <p className="mt-1 font-medium">${c.price}</p>
            </li>
          ))}
        </ul>
      </main>
      <BaseFooter />
    </>
  );
}
