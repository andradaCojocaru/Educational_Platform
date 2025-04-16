import React from "react";

function BaseFooter() {
    return (
        <footer className="footer bg-dark text-white text-center py-3">
            <div className="container">
                <p>
                    &copy; {new Date().getFullYear()} Educational Platform.
                </p>
            </div>
        </footer>
    );
}

export default BaseFooter;