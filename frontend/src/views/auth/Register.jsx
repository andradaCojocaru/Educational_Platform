import { useState } from "react";
import Toast from "../plugin/Toast";
import { Link, useNavigate } from "react-router-dom";

import BaseHeader from "../partials/BaseHeader";
import BaseFooter from "../partials/BaseFooter";

import { userRegister } from "../../utils/auth";

function Register() {
  const [userFullName, setUserFullName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userPasswordMatched, setUserPasswordMatched] = useState("");
  const [userRole, setUserRole] = useState("student"); // Default role is 'student'
  const [isLoadingState, setIsLoadingState] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoadingState(true);

    const { error } = await userRegister(
      userFullName,
      userEmail,
      userPassword,
      userPasswordMatched,
      userRole // Pass the selected role
    );
    if (error) {
      Toast().fire({
        icon: "warning",
        text: error,
      });
      setIsLoadingState(false);
    } else {
      navigate("/login");
      Toast().fire({
        icon: "success",
        title: "Registration Successful, you have now been logged in",
      });
      setIsLoadingState(false);
    }
  };

  return (
    <>
      <section
        className="container d-flex flex-column vh-100"
        style={{ marginTop: "150px" }}
      >
        <div className="row align-items-center justify-content-center g-0 h-lg-100 py-8">
          <div className="col-lg-5 col-md-8 py-8 py-xl-0">
            <div className="card shadow">
              <div className="card-body p-6">
                <div className="mb-4">
                  <h1 className="mb-1 fw-bold">Sign up</h1>
                  <span>
                    Already have an account?
                    <Link to="/login/" className="ms-1">
                      Sign In
                    </Link>
                  </span>
                </div>
                {/* Form */}
                <form
                  className="needs-validation"
                  noValidate=""
                  onSubmit={handleRegister}
                >
                  {/* Full Name */}
                  <div className="mb-3">
                    <label htmlFor="full_name" className="form-label">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      className="form-control"
                      name="full_name"
                      required=""
                      onChange={(e) => setUserFullName(e.target.value)}
                    />
                  </div>

                  {/* Email Address */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      name="email"
                      required=""
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>

                  {/* Password */}
                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      id="password"
                      className="form-control"
                      name="password"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setUserPassword(e.target.value)}
                    />
                  </div>

                  {/* Confirm Password */}
                  <div className="mb-3">
                    <label htmlFor="passwordMatched" className="form-label">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      id="passwordMatched"
                      className="form-control"
                      name="passwordMatched"
                      placeholder="**************"
                      required=""
                      onChange={(e) => setUserPasswordMatched(e.target.value)}
                    />
                  </div>

                  {/* Role Selection */}
                  <div className="mb-3">
                    <label htmlFor="role" className="form-label">
                      Select Role
                    </label>
                    <select
                      id="role"
                      className="form-control"
                      value={userRole}
                      onChange={(e) => setUserRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                    </select>
                  </div>

                  {/* Submit Button */}
                  <div>
                    <div className="d-grid">
                      {isLoadingState === true && (
                        <button
                          disabled
                          type="submit"
                          className="btn btn-danger"
                        >
                          Processing <i className="fas fa-spinner fa-spin"></i>
                        </button>
                      )}

                      {isLoadingState === false && (
                        <button type="submit" className="btn btn-danger">
                          Sign Up <i className="fas fa-user-plus"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default Register;
