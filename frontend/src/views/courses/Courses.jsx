import React, { useState, useEffect } from "react";
import CourseStatsChart from "../../../components/CourseStatsChart";
import ReviewsChart from "../../../components/ReviewsChart";
import TeacherContributionChart from "../../../components/TeacherContributionChart";

import {
  getCourses,
  getTeachers,
  createCourse,
  enrollStudent,
  deleteCourse,
  unenrollStudent,
  updateCourse,
  rateCourse,
  getUserReview, // Import the function to fetch user reviews
} from "../../utils/courses";
import { useAuthStore } from "../../store/auth";

const Courses = () => {
  const { user, loadingState } = useAuthStore();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [formData, setFormData] = useState({ title: "", description: "", teacher_id: "" });
  const [enrollData, setEnrollData] = useState({});
  const [showStudents, setShowStudents] = useState({});
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [editDescription, setEditDescription] = useState("");
  const [userReviews, setUserReviews] = useState({}); // Store user reviews for each course

  const fetchCourses = async (currentUser) => {
    try {
      const response = await getCourses();
      const allCourses = response.data;

      // Map courses to include user-specific reviews
      const updatedCourses = allCourses.map((course) => ({
        ...course,
        user_review: course.user_review || null, // Add user_review field
      }));

      if (currentUser?.role === "student") {
        const enrolledCourses = updatedCourses.filter((course) =>
          course.students.includes(currentUser.email)
        );
        console.log("Enrolled Courses:", enrolledCourses);
        setCourses(enrolledCourses);
      } else {
        setCourses(updatedCourses);
      }

      // Fetch user reviews for each course
      const reviews = {};
      for (const course of allCourses) {
        try {
          const reviewResponse = await getUserReview(course.id);
          reviews[course.id] = reviewResponse.data.rating; // Store the rating
        } catch (error) {
          if (error.response?.status === 404) {
            reviews[course.id] = null; // No review found
          } else {
            console.error(`Error fetching review for course ${course.id}:`, error);
          }
        }
      }
      setUserReviews(reviews);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(formData);
      alert("Course created successfully!");
      setFormData({ title: "", description: "", teacher_id: "" });
      fetchCourses(user);
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Failed to create course.");
    }
  };

  const handleRateCourse = async (courseId, rating) => {
    try {
      await rateCourse(courseId, { rating });
      alert("Rating submitted successfully!");
      fetchCourses(user); // Refresh courses to update the review
    } catch (error) {
      console.error("Error submitting rating:", error);
      alert("Failed to submit rating.");
    }
  };

  const renderStars = (rating) => {
    const maxStars = 5; // Maximum number of stars
    return [...Array(maxStars)].map((_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? "gold" : "gray",
          fontSize: "1.5rem",
        }}
      >
        ★
      </span>
    ));
  };

  const renderStudentRating = (course) => {
    const userRating = userReviews[course.id]; // Get the user's review for this course
  
    if (userRating !== null && userRating !== undefined) {
      // If the user has already rated, display their review
      return (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Your Rating:</strong> {renderStars(userRating)} ({userRating} ★)
          </p>
        </div>
      );
    }
  
    // If the user hasn't rated yet (404 Not Found), display "Add Rating" option
    return (
      <div style={{ marginTop: "1rem" }}>
        <p>Add your rating:</p>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            onClick={() => handleRateCourse(course.id, star)}
            style={{
              cursor: "pointer",
              color: "gray",
              fontSize: "1.5rem",
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
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

  const handleUnenroll = async (courseId, studentEmail) => {
    try {
      await unenrollStudent(courseId, studentEmail);
      alert("Student unenrolled successfully!");
      fetchCourses(user);
    } catch (error) {
      console.error("Error unenrolling student:", error);
      alert("Failed to unenroll student.");
    }
  };

  const toggleStudents = (courseId) => {
    setShowStudents((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
  };

  const handleEditClick = (course) => {
    setEditingCourseId(course.id);
    setEditDescription(course.description);
  };

  const handleUpdateCourse = async (courseId) => {
    try {
      await updateCourse(courseId, { description: editDescription });
      alert("Course description updated successfully!");
      setEditingCourseId(null);
      fetchCourses(user);
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Failed to update course.");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    try {
      await deleteCourse(courseId); // Call the API to delete the course
      alert("Course deleted successfully!");
      fetchCourses(user); // Refresh the courses list
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Failed to delete course.");
    }
  };

  const handleCancelEdit = () => {
    setEditingCourseId(null);
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
      <div>
      {user?.role === "teacher" && courses.length > 0 && (
        <CourseStatsChart courses={courses} />
      )}
      </div>

      <div>
      {/* Display the chart for average ratings */}
      {courses.length > 0 && <ReviewsChart courses={courses} />}
      </div>

      <div>
      {user?.role === "teacher" && courses.length > 0 && (
        <TeacherContributionChart courses={courses} />
      )}
      </div>
      

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
            <p>
              <strong>Average Rating:</strong>{" "}
              {course.average_rating ? (
                <span>
                  {renderStars(Math.round(course.average_rating))} (
                  {course.average_rating.toFixed(1)})
                </span>
              ) : (
                "No ratings yet"
              )}
            </p>

            {/* Student Rating Section */}
            {user?.role === "student" && renderStudentRating(course)}

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
                  backgroundColor: "orange",
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
                    <li key={student}>
                      {student}{" "}
                      {user?.role === "teacher" && (
                        <button
                          onClick={() => handleUnenroll(course.id, student)}
                          style={{
                            marginLeft: "0.5rem",
                            padding: "0.2rem 0.5rem",
                            backgroundColor: "red",
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