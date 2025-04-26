import React, { useState, useEffect } from "react";
import { getCourses, createCourse } from "../../utils/courses";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const fetchCourses = async () => {
    try {
      const response = await getCourses();
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      setFormData({ title: "", description: "" });
      fetchCourses(); // Refresh course list
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Courses</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
        <div>
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
          />
        </div>
        <div>
          <textarea
            name="description"
            placeholder="Course Description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
          />
        </div>
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Create Course
        </button>
      </form>

      <ul>
        {courses.map((course) => (
          <li key={course.id} style={{ marginBottom: "1rem" }}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <small>Created at: {new Date(course.created_at).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
