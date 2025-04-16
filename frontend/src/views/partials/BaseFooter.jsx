import React from "react";

function BaseFooter() {
    return (
        <footer className="footer bg-dark text-white text-center py-3">
            <div className="container">
                <p>
                    <a href="#" className="text-white me-3">Privacy Policy</a>
                    <a href="#" className="text-white">Terms of Use</a>
                </p>
            </div>
        </footer>
    );
}

export default BaseFooter;