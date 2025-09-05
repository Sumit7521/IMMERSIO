import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import CityScene from "../components/world/CityScene";
import { CharacterController } from "../components/player/CharacterController";

export default function Metaverse({ userId }) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
    };
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", position: "relative" }}>
      {/* Instructions overlay */}
      {!isPointerLocked && (
        <div style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          color: 'white',
          background: 'rgba(0,0,0,0.7)',
          padding: '10px',
          borderRadius: '5px',
          fontSize: '14px',
          zIndex: 1000
        }}>
          Click to enable mouse look
          <br />
          WASD: Move | Shift: Run | ESC: Release mouse
        </div>
      )}
      
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
        <Canvas shadows camera={{ position: [0, 10, 20], fov: 30 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <Physics gravity={[0, -9.81, 0]} >
            <CityScene  />
            <CharacterController userId={userId} />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}