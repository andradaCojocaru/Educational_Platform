import React from "react";

const Home = () => {
  return (
    <div
      style={{
        backgroundImage: "url('/images/10-Benefits-Showing-Why-Education-Is-Important-to-Our-Society.jpg')", // Relative path to the image
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
      }}
    >
      <h1>Welcome to the Educational Platform</h1>
    </div>
  );
};

export default Home;