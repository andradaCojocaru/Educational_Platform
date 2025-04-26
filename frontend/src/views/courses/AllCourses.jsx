// src/views/courses/AllCourses.jsx
import { useEffect, useState } from "react";
import useAxios    from "../../utils/useAxios";
import BaseHeader  from "../partials/BaseHeader";
import BaseFooter  from "../partials/BaseFooter";

export default function AllCourses() {
  const api = useAxios();           // folosește instanța cu token
  const [courses, setCourses] = useState(null);
  const [error,   setError]   = useState("");

  useEffect(() => {
    api.get("/courses/")
       .then(res => setCourses(res.data))
       .catch(e  => setError(e.response?.data.detail || e.message));
  }, []);

  return (
    <>
      <BaseHeader />

      <main className="container mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-6">Toate cursurile</h1>

        {error && <p className="text-red-600">{error}</p>}
        {!courses && !error && <p>Se încarcă…</p>}
        {courses?.length === 0 && <p>Nu există niciun curs publicat.</p>}

        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses?.map(c => (
            <li
              key={c.id}
              className="border rounded-xl p-5 shadow-sm hover:shadow transition"
            >
              <h2 className="text-lg font-bold">{c.title}</h2>
              <p className="text-sm text-gray-600">{c.category}</p>

              <p className="mt-2 line-clamp-3">{c.description}</p>
              <p className="mt-3 font-medium">${Number(c.price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
      </main>

      <BaseFooter />
    </>
  );
}
