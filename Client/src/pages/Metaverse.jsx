import React from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import CityScene from "../components/world/CityScene";
import { CharacterController } from "../components/player/CharacterController";

export default function Metaverse({ userId }) {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["w", "ArrowUp"] },
          { name: "backward", keys: ["s", "ArrowDown"] },
          { name: "left", keys: ["a", "ArrowLeft"] },
          { name: "right", keys: ["d", "ArrowRight"] },
          { name: "run", keys: ["Shift"] },
          { name: "jump", keys: [" "] },
        ]}
      >
        <Canvas shadows camera={{ position: [0, 10, 20], fov: 60 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Physics gravity={[0, -9.81, 0]} debug>
            <CityScene />
            <CharacterController userId={userId} />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
