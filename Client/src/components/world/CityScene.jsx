// src/components/world/CityScene.jsx
import React from "react"
import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier"

export default function CityScene() {
  // Load the city model from public folder
  const { scene } = useGLTF("/models/City.glb")

  return (
    <RigidBody type="fixed" colliders='trimesh'>
      <primitive object={scene} scale={1} position={[0, 0, 0]} />
    </RigidBody>
  );
}
