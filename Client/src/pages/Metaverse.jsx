// Metaverse.js (Updated)
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls } from "@react-three/drei";
import CityScene from "../components/world/CityScene";
import { CharacterController } from "../components/Player/CharacterController";
import { DynamicSky } from "../components/world/DynamicSky";
// import { Rain } from "../components/world/Rain"; // Commented out as in your original

export default function Metaverse({ userId }) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);

  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    const handleKeyDown = (event) => {
      if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key) || event.code === 'Space') {
        event.preventDefault();
      }
    };

    const handleKeyUp = (event) => {
      if (['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'].includes(event.key) || event.code === 'Space') {
        event.preventDefault();
      }
    };

    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('keyup', handleKeyUp, true);

    return () => {
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('keyup', handleKeyUp, true);
    };
  }, []);

  const keyMap = [
    { name: "forward", keys: ["KeyW", "ArrowUp"] },
    { name: "backward", keys: ["KeyS", "ArrowDown"] },
    { name: "left", keys: ["KeyA", "ArrowLeft"] },
    { name: "right", keys: ["KeyD", "ArrowRight"] },
    { name: "run", keys: ["ShiftLeft", "ShiftRight"] },
    { name: "jump", keys: ["Space"] },
  ];

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
          WASD: Move | Shift: Run | Space: Jump | ESC: Release mouse
          <br />
          🌐 Multiplayer Ready
        </div>
      )}

      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ position: [0, 10, 20], fov: 30 }}
          onCreated={(state) => { state.gl.domElement.tabIndex = 1; }}
        >
          {/* Dynamic sky, lighting, and fog */}
          <DynamicSky useCustomHDRI={true} />
          {/* <Rain count={18000} /> */}

          <Physics gravity={[0, -9.81, 0]}>
            <CityScene />
            <CharacterController userId={userId} />
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}