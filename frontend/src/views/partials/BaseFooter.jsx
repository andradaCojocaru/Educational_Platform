import React from "react";

function BaseFooter() {
  return (
    <footer className="footer bg-dark text-white text-center py-3 mt-5">
      <div className="container">
        <p>
          &copy; {new Date().getFullYear()} Educational Platform. All rights
          reserved.
        </p>
      </div>
    </footer>
  );
}

export default BaseFooter;
