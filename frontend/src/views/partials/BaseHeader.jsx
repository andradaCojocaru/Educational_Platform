import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth";

function BaseHeader() {
    const navigate = useNavigate();

    const handleSearchSubmit = () => {
        navigate(`/search/?search=${searchQuery}`);
    };

    const [isLoggedIn, user] = useAuthStore((state) => [state.isLoggedIn, state.user]);

    return (
        <div>
            <nav className="navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
                <div className="container">
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
                            <>
                                <Link to="/logout/" className="btn btn-primary ms-2" type="submit">
                                    Logout <i className="fas fa-usign-out-alt"></i>
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Login and register button */}
                                <Link to="/login/" className="btn btn-primary ms-2" type="submit">
                                    Login <i className="fas fa-sign-in-alt"></i>
                                </Link>
                                <Link
                                    to="/register/"
                                    className="btn btn-primary ms-2"
                                    type="submit"
                                >
                                    Register <i className="fas fa-user-plus"> </i>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default BaseHeader;
