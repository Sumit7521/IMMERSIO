// src/components/world/CityScene.jsx
import React from "react";
import { useGLTF } from "@react-three/drei";

export default function CityScene() {
  // Load the city model from public folder
  const { scene } = useGLTF("/models/City.glb");

  return (
    <primitive object={scene} scale={1} position={[0, 0, 0]} />
  );
}
