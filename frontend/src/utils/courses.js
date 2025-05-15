import apiInstance from "./axios";


/**
 * Fetch all courses.
 * @returns {Promise}
 */
export const getCourses = () => {
  return apiInstance.get("courses/");
};

/**
 * Create a new course.
 * @param {Object} courseData
 * @param {string} courseData.title
 * @param {string} courseData.description
 * @returns {Promise}
 */
export const createCourse = (courseData) => {
  return apiInstance.post("courses/", courseData);
};

/**
 * Update an existing course.
 * @param {number} courseId
 * @param {Object} courseData
 * @returns {Promise}
 */
export const updateCourse = (courseId, courseData) => {
  return apiInstance.put(`/courses/${courseId}/`, courseData);
};

/**
 * Delete a course.
 * @param {number} courseId
 * @returns {Promise}
 */
export const deleteCourse = (courseId) => {
  return apiInstance.delete(`/courses/${courseId}/`);
};

/**
 * Enroll a student into a course by email.
 * @param {number} courseId
 * @param {string} studentEmail
 * @returns {Promise}
 */
export const enrollStudent = (courseId, studentEmail) => {
  return apiInstance.post(`/courses/${courseId}/enroll/`, {
    student_email: studentEmail,
  });
};
/**
 * Un-enroll a student.
 */
export const unenrollStudent = (courseId, studentEmail) =>
  apiInstance.post(`courses/${courseId}/unenroll/`, {
    student_email: studentEmail,
  });

export const getTeachers = () => apiInstance.get("teachers/");


export const updateCourseDescription = async (courseId, description) => {
  return await apiInstance.put(`/courses/${courseId}/`, { description });
};