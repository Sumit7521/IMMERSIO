// components/Player/LocationPopup.js
import React, { useState, useEffect } from "react";
import { Html } from "@react-three/drei";
import { useNavigate } from "react-router";
import { useControls } from "leva";

const LocationPopup = ({ playerPos }) => {
  const navigate = useNavigate();

  // --- Leva controls for popup position & distance ---
  const { x, y, z, triggerDistance } = useControls("Popup", {
    x: { value: 98, min: -200, max: 200, step: 0.1 },
    y: { value: -2, min: -50, max: 50, step: 0.1 },
    z: { value: -9, min: -200, max: 200, step: 0.1 },
    triggerDistance: { value: 5, min: 1, max: 20, step: 0.1 },
  });

  const triggerPos = { x, y, z };

  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (!playerPos) return;
    const dist = Math.sqrt(
      (playerPos.x - triggerPos.x) ** 2 +
      (playerPos.y - triggerPos.y) ** 2 +
      (playerPos.z - triggerPos.z) ** 2
    );
    setShowPopup(dist < triggerDistance);
  }, [playerPos, triggerPos, triggerDistance]);

  if (!showPopup) return null;

  return (
    <Html position={[triggerPos.x, triggerPos.y, triggerPos.z]} transform distanceFactor={1}>
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-2xl shadow-xl flex flex-col items-center w-[80vw] max-w-[800px] h-[70vh] max-h-[550px] gap-4 text-white">
        <img
          src="./images/techno full logo.png"
          alt="Techno India"
          className="w-[90%] h-[25%] object-cover rounded-xl mt-3 mb-2"
        />
        <div className="w-[90%] flex flex-col gap-2 items-center text-center">
          <h2 className="text-[4vw] md:text-[3vw] font-bold mb-2">
            Welcome to Techno India University!
          </h2>
          <p className="text-[2vw] md:text-[2vw] mb-3">Where do you want to go?</p>
        </div>
        <div className="flex gap-[2%] h-[40%] w-[90%]">
          <button
            onClick={() => navigate("/ai-classroom")}
            className="h-[100%] font-semibold text-[2vw] md:text-[1.5vw] flex-1 bg-red-500 rounded-md text-white cursor-pointer"
          >
            AI Classroom
          </button>
          <button
            onClick={() => navigate("/virtual-classroom")}
            className="h-[100%] font-semibold text-[2vw] md:text-[1.5vw] flex-1 bg-red-500 rounded-md text-white cursor-pointer"
          >
            Virtual Classroom
          </button>
        </div>
      </div>
    </Html>
  );
};

export default LocationPopup;
