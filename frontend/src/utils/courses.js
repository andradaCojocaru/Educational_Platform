import apiInstance from "./axios"; // Ensure this is imported only once

// Function to leave a review
export const leaveReview = async (courseId, data) => {
  return await apiInstance.post(`/courses/${courseId}/review/`, data);
};

// Function to get all courses
export const getCourses = async () => {
  return await apiInstance.get("/courses/");
};

// Function to get all teachers
export const getTeachers = async () => {
  return await apiInstance.get("/teachers/");
};

// Function to create a course
export const createCourse = async (data) => {
  return await apiInstance.post("/courses/", data);
};

// Function to enroll a student
export const enrollStudent = async (courseId, studentEmail) => {
  return await apiInstance.post(`/courses/${courseId}/enroll/`,  {
    student_email: studentEmail,
  });
};

// Function to delete a course
export const deleteCourse = async (courseId) => {
  return await apiInstance.delete(`/courses/${courseId}/`);
};

// Function to unenroll a student
export const unenrollStudent = async (courseId, studentEmail) => {
  return await apiInstance.post(`/courses/${courseId}/unenroll/`,  {
    student_email: studentEmail,
  });
};

// Function to update a course
export const updateCourse = async (courseId, data) => {
  return await apiInstance.put(`/courses/${courseId}/`, data);
};

export const rateCourse = async (courseId, data) => {
  return await apiInstance.post(`/courses/${courseId}/rate/`, data);
};

// Function to fetch a user's review for a specific course
export const getUserReview = async (courseId) => {
  return await apiInstance.get(`/courses/${courseId}/user-review/`);
};