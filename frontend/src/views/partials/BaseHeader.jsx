import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function BaseHeader() {
  const navigate = useNavigate();
  const [isLoggedIn, user] = useAuthStore((state) => [
    state.isLoggedIn,
    state.user,
  ]);

  return (
    <div>
      <nav
        className="navbar navbar-expand-lg navbar-dark bg-dark"
        data-bs-theme="dark"
      >
        <div className="container">
          <Link className="navbar-brand" to="/">
            Educational Platform
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            {isLoggedIn() === true ? (
              <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                <li className="nav-item">
                  <Link to="/courses" className="nav-link">
                    Courses
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/students" className="nav-link">
                    Students
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/teachers" className="nav-link">
                    Teachers
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/settings" className="nav-link">
                    Settings
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/logout" className="btn btn-primary ms-3">
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <div className="ms-auto">
                <Link
                  to="/login/"
                  className="btn btn-primary ms-2"
                  type="submit"
                >
                  Login
                </Link>
                <Link
                  to="/register/"
                  className="btn btn-primary ms-2"
                  type="submit"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  );
}

export default BaseHeader;
