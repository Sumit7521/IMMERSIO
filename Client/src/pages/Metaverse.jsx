// src/pages/Metaverse.jsx
import React from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import CityScene from "../components/world/CityScene";
import Avatar from "../components/Player/Avatar";

export default function Metaverse({ userId }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas camera={{ position: [0, 10, 20], fov: 60 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        {/* City */}
        <CityScene />

        {/* Avatar */}
        <Avatar userId={userId} position={[0, 0, 0]} scale={1} />

        {/* Controls (for now OrbitControls, later replace with PlayerController) */}
        <OrbitControls target={[0, 1, 0]} />
      </Canvas>
    </div>
  );
}
