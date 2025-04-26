import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";

import MainWrapper      from "./layouts/MainWrapper";
import PrivateRoute     from "./layouts/PrivateRoute";
import CoursesList      from "./views/courses/CoursesList";
import Register         from "./views/auth/Register";
import Login            from "./views/auth/Login";
import Logout           from "./views/auth/Logout";
import ForgotPassword   from "./views/auth/ForgotPassword";
import CreateNewPw      from "./views/auth/CreateNewPassword";
import Dashboard        from "./views/dashboard/Dashboard";
import AllCourses       from "./views/courses/AllCourses";

import { useAuthStore } from "./store/auth";
import { bootstrapAuth } from "./utils/auth";   //  ← new import

/* redirect “/” depending on login status */
// const HomeRedirect = () => {
//   const loggedIn = useAuthStore(s => s.allUserData !== null);   // boolean!
//   return <Navigate to={loggedIn ? "/courses/" : "/login/"} replace />;
// };

function App() {
  /* hydrate the store ONCE, right after the first paint */
  useEffect(() => { bootstrapAuth(); }, []);

  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          {/* root -------------------------------------------------- */}
          {/* <Route path="/" element={<HomeRedirect />} /> */}

          {/* auth -------------------------------------------------- */}
          <Route path="/register/"            element={<Register />} />
          <Route path="/login/"               element={<Login />} />
          <Route path="/logout/"              element={<Logout />} />
          <Route path="/forgot-password/"     element={<ForgotPassword />} />
          <Route path="/create-new-password/" element={<CreateNewPw />} />

          {/* my courses  (student + teacher + admin) --------------- */}
          <Route
            path="/courses/"
            element={
              <PrivateRoute allowedRoles={["student", "teacher", "admin"]}>
                <CoursesList />
              </PrivateRoute>
            }
          />

          {/* dashboard (teacher + admin) --------------------------- */}
          <Route
            path="/dashboard/"
            element={
              <PrivateRoute allowedRoles={["teacher", "admin"]}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route path="/all-courses/" element={<AllCourses />} />

          {/* fallback --------------------------------------------- */}
          {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  );
}

export default App;
