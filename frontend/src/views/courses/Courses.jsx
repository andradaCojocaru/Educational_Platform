import React, { useState, useEffect } from "react";
import CourseStatsChart from "../../../components/CourseStatsChart";

import {
  getCourses,
  getTeachers,
  createCourse,
  enrollStudent,
  deleteCourse,
  unenrollStudent,
  updateCourse, // Add this utility for updating courses
} from "../../utils/courses";
import { useAuthStore } from "../../store/auth";

const Courses = () => {
  const { user, loadingState } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", teacher_id: "" });
  const [enrollData, setEnrollData] = useState({});
  const [showStudents, setShowStudents] = useState({});
  const [editingCourseId, setEditingCourseId] = useState(null); // Track which course is being edited
  const [editDescription, setEditDescription] = useState(""); // Track the updated description

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

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setEditDescription(course.description);
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      await updateCourse(courseId, { description: editDescription });
      alert("Course description updated successfully!");
      setEditingCourseId(null); // Exit editing mode
      fetchCourses(user); // Refresh courses
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null); // Exit editing mode
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
        <form onSubmit={handleSubmit} style={{ marginBottom: "2rem" }}>
          <div>
            <input
              type="text"
              name="title"
              placeholder="Course Title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
              required
              style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label>Select Teacher:&nbsp;</label>
            <select
              name="teacher_id"
              value={formData.teacher_id}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
              required
              style={{ padding: "0.4rem" }}
            >
              <option value="" disabled>
                Choose…
              </option>
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
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
              }
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

            {/* Editable description */}
            {editingCourseId === course.id ? (
              <div>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="4"
                  style={{ marginBottom: "1rem", padding: "0.5rem", width: "100%" }}
                />
                <button
                  onClick={() => handleUpdateCourse(course.id)}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "green",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    marginRight: "0.5rem",
                  }}
                >
                  Save
                </button>
                <button
                  onClick={handleCancelEdit}
                  style={{
                    padding: "0.5rem 1rem",
                    backgroundColor: "gray",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <p>{course.description}</p>
                {user?.role === "teacher" && (
                  <button
                    onClick={() => handleEditClick(course)}
                    style={{
                      padding: "0.5rem",
                      backgroundColor: "blue",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Edit Description
                  </button>
                )}
              </>
            )}

            {/* Enroll student */}
            {user?.role === "teacher" && (
              <div style={{ marginTop: "1rem" }}>
                <input
                  type="email"
                  placeholder="Student Email"
                  value={enrollData[course.id] || ""}
                  onChange={(e) => handleEnrollChange(course.id, e.target.value)}
                  style={{ marginBottom: "0.5rem", padding: "0.5rem", width: "100%" }}
                />
                <button
                  onClick={() => handleEnroll(course.id)}
                  style={{
                    padding: "0.5rem",
                    backgroundColor: "blue",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                >
                  Enroll Student
                </button>
              </div>
            )}

            {/* Show students */}
            <div style={{ marginTop: "1rem" }}>
              <button
                onClick={() => toggleStudents(course.id)}
                style={{
                  padding: "0.5rem",
                  backgroundColor: "blue",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                {showStudents[course.id] ? "Hide Students" : "Show Students"}
              </button>
              {showStudents[course.id] && (
                <ul style={{ marginTop: "0.5rem" }}>
                  {course.students.map((student) => (
                    <li key={student}>{student}</li>
                  ))}
                </ul>
              )}
            </div>

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
        ))}
      </div>
    </div>
  );
};

export default Courses;