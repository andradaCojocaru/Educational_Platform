import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

import MainWrapper from "./layouts/MainWrapper";

import Register from "../src/views/auth/Register";
import Login from "../src/views/auth/Login";
import Logout from "./views/auth/Logout";
import ForgotPassword from "./views/auth/ForgotPassword";
import CreateNewPassword from "./views/auth/CreateNewPassword";

import Courses from "./views/courses/Courses"; // <-- ✨ NEW import

/**
 * The top-level component that sets up the application context and routing.
 * It provides a `CartContext` and `ProfileContext` to manage and access the cart count and user profile data throughout the application.
 * It also sets up the router with routes for authentication-related components.
 *
 * @returns {JSX.Element} The JSX element representing the application structure with context providers and routes.
 */
function App() {
  return (
    <BrowserRouter>
      <MainWrapper>
        <Routes>
          {/* Auth Routes */}
          <Route path="/register/" element={<Register />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/logout/" element={<Logout />} />
          <Route path="/forgot-password/" element={<ForgotPassword />} />
          <Route path="/create-new-password/" element={<CreateNewPassword />} />

          {/* ✨ New Courses Route */}
          <Route path="/courses/" element={<Courses />} />
        </Routes>
      </MainWrapper>
    </BrowserRouter>
  );
}

export default App;
