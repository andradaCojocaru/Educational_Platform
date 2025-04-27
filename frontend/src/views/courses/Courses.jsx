import React, { useState, useEffect } from "react";
import { getCourses, createCourse, enrollStudent } from "../../utils/courses";
import { useAuthStore } from "../../store/auth";

const Courses = () => {
  const { user, loadingState } = useAuthStore(); // <-- add loadingState

  console.log("User loaded:", user);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [enrollData, setEnrollData] = useState({});
  const [showStudents, setShowStudents] = useState({}); // NEW: track shown students per course

  const fetchCourses = async (currentUser) => {
    console.log("Fetching courses for user:", currentUser);

    const response = await getCourses();
    console.log("Raw course list from server:", response.data);

    const allCourses = response.data;

    if (currentUser?.role === "student") {
      const enrolledCourses = allCourses.filter((course) =>
        course.students.includes(currentUser.email)
      );
      console.log("Student enrolled courses:", enrolledCourses);
      setCourses(enrolledCourses);
    } else {
      console.log("Teacher sees all courses:", allCourses);
      setCourses(allCourses);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleEnrollChange = (courseId, value) => {
    setEnrollData((prev) => ({
      ...prev,
      [courseId]: value,
    }));
  };

  const handleEnroll = async (courseId) => {
    try {
      await enrollStudent(courseId, enrollData[courseId]);
      alert("Student enrolled successfully!");
      setEnrollData((prev) => ({ ...prev, [courseId]: "" }));
      fetchCourses(user); // ✅ CORRECT
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert("Failed to enroll student.");
    }
  };

  const toggleStudents = (courseId) => {
    setShowStudents((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      setFormData({ title: "", description: "" });
      fetchCourses(user); // ✅ CORRECT
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  useEffect(() => {
    if (!loadingState && user) {
      fetchCourses(user);
    }
  }, [loadingState, user]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Courses</h1>
      {user?.role === "teacher" && (
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
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        {courses.map((course) => (
          <div
            key={course.id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "1rem",
              boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
            }}
          >
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <small>
              Created at: {new Date(course.created_at).toLocaleString()}
            </small>

            {/* ✨ Enroll student form */}
            {user?.role === "teacher" && (
              <div style={{ marginTop: "1rem" }}>
                <input
                  type="email"
                  placeholder="Student Email"
                  value={enrollData[course.id] || ""}
                  onChange={(e) =>
                    handleEnrollChange(course.id, e.target.value)
                  }
                  style={{ marginRight: "0.5rem", padding: "0.25rem" }}
                />
                <button
                  onClick={() => handleEnroll(course.id)}
                  style={{ padding: "0.25rem 0.5rem" }}
                >
                  Enroll Student
                </button>
              </div>
            )}

            {/* ✨ Show students button */}
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => toggleStudents(course.id)}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                {showStudents[course.id] ? "Hide Students" : "Show Students"}
              </button>

              {/* ✨ Display list if visible */}
              {showStudents[course.id] && (
                <ul style={{ marginTop: "0.5rem" }}>
                  {course.students.length > 0 ? (
                    course.students.map((email, idx) => (
                      <li key={idx}>{email}</li>
                    ))
                  ) : (
                    <li>No students enrolled yet.</li>
                  )}
                </ul>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
