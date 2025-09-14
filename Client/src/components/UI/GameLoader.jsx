import React from "react";

export default function GameLoader() {
  return (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "black",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      color: "white",
      fontSize: "2rem",
      zIndex: 1000,
      transition: "opacity 0.5s ease"
    }}>
      <div className="loader">
        <span>Loading your character...</span>
      </div>
    </div>
  );
}
