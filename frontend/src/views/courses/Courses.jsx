import React, { useState, useEffect } from "react";
import CourseStatsChart from "../../../components/CourseStatsChart";

import { getCourses, getTeachers, createCourse, enrollStudent, deleteCourse, unenrollStudent } from "../../utils/courses";
import { useAuthStore } from "../../store/auth";

const Courses = () => {
  const { user, loadingState } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", teacher_id: "" });
  const [enrollData, setEnrollData] = useState({});
  const [showStudents, setShowStudents] = useState({});

  const fetchCourses = async (currentUser) => {
    try {
      const response = await getCourses();
      const allCourses = response.data;

      if (currentUser?.role === "student") {
        const enrolledCourses = allCourses.filter((course) =>
          course.students.includes(currentUser.email)
        );
        setCourses(enrolledCourses);
      } else {
        setCourses(allCourses);
      }
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
      fetchCourses(user);
    } catch (error) {
      console.error("Error enrolling student:", error);
      alert("Failed to enroll student.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await deleteCourse(courseId);
        alert("Course deleted successfully!");
        fetchCourses(user);
      } catch (error) {
        console.error("Error deleting course:", error);
        alert("Failed to delete course.");
      }
    }
  };

  const handleUnenroll = async (courseId, studentEmail) => {
    if (window.confirm(`Are you sure you want to unenroll ${studentEmail}?`)) {
      try {
        await unenrollStudent(courseId, studentEmail);
        alert("Student unenrolled successfully!");
        fetchCourses(user);
      } catch (error) {
        console.error("Error unenrolling student:", error);
        alert("Failed to unenroll student.");
      }
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
      setFormData({ title: "", description: "", teacher_id: "" });
      fetchCourses(user);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course.");
    }
  };

  useEffect(() => {
    if (!loadingState && user) {
      fetchCourses(user);
      getTeachers().then((res) => setTeachers(res.data));
    }
  }, [loadingState, user]);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Courses</h1>
      {user?.role === "teacher" && courses.length > 0 && (
        <CourseStatsChart courses={courses} />
      )}
      {/* Form for teachers to create a course */}
      {user?.role === "teacher" && (
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem"}}>
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
          <div style={{ marginBottom: "1rem" }}>
            <label>Select Teacher:&nbsp;</label>
            <select
              name="teacher_id"
              value={formData.teacher_id}
              onChange={handleChange}
              required
              style={{ padding: "0.4rem" }}
            >
              <option value="" disabled>Choose…</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.full_name} ({t.email})
                </option>
              ))}
            </select>
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

      {/* List of courses */}
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
            <p>
              <strong>Teacher:</strong>{" "}
              {course.teacher ? course.teacher.full_name : "—"}
            </p>
            <p>{course.description}</p>

            {/* Teacher actions */}
            {user?.role === "teacher" && (
              <>
                {/* Enroll a student */}
                <div style={{ marginTop: "1rem" }}>
                  <input
                    type="email"
                    placeholder="Student Email"
                    value={enrollData[course.id] || ""}
                    onChange={(e) =>
                      handleEnrollChange(course.id, e.target.value)
                    }
                    style={{ marginBottom: "0.5rem", marginRight: "0.5rem", padding: "0.25rem" }}
                  />
                  <button
                    onClick={() => handleEnroll(course.id)}
                    style={{ padding: "0.25rem 0.5rem" }}
                  >
                    Enroll Student
                  </button>
                </div>
              </>
            )}

            {/* Show students toggle */}
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => toggleStudents(course.id)}
                style={{ padding: "0.25rem 0.5rem" }}
              >
                {showStudents[course.id] ? "Hide Students" : "Show Students"}
              </button>

              {/* Students list */}
              {showStudents[course.id] && (
                <ul style={{ marginTop: "0.5rem", paddingLeft: 0, listStyle: "none" }}>
                  {course.students.length > 0 ? (
                    course.students.map((email, idx) => (
                      <li
                        key={idx}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          flexWrap: "wrap",
                          wordBreak: "break-word"
                        }}
                      >
                        <span style={{ flex: "1 1 auto" }}>{email}</span>
                        {user?.role === "teacher" && (
                          <button
                            onClick={() => handleUnenroll(course.id, email)}
                            style={{
                              marginLeft: "1rem",
                              marginBottom: "0.35rem",
                              padding: "0.25rem",
                              backgroundColor: "orange",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                          >
                            Unenroll
                          </button>
                        )}
                      </li>
                    ))
                  ) : (
                    <li>No students enrolled yet.</li>
                  )}
                </ul>
              )}

                {/* Delete course */}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Course
                  </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Courses;
