import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const BaseHeader = () => {
  const { userRole, loading, userName, logout } = useContext(UserContext);
  const navigate = useNavigate();

  if (loading) return null;

  const handleLogout = () => {
    logout(); // Clear context + localStorage
    navigate("/login"); // Redirect to login page
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
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
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to="/courses" className="nav-link">
                Courses
              </Link>
            </li>
            {userRole === "teacher" && (
              <li className="nav-item">
                <Link to="/students" className="nav-link">
                  Students
                </Link>
              </li>
            )}
            {userName && (
              <li className="nav-item">
                <span className="nav-link">
                  Welcome, {userName} ({userRole})
                </span>
              </li>
            )}
            <li className="nav-item">
              <button onClick={handleLogout} className="btn btn-primary ms-3">
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default BaseHeader;
