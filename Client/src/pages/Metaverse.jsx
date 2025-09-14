// src/pages/Metaverse.jsx
import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { KeyboardControls, useGLTF } from "@react-three/drei";
import CityScene from "../components/world/CityScene";
import { CharacterController } from "../components/Player/CharacterController";
import { DynamicSky } from "../components/world/DynamicSky";
// import { Rain } from "../components/world/Rain";
import GameLoader from "../components/UI/GameLoader";
import { useAvatar } from "../contexts/AvatarContext";

export default function Metaverse({ userId }) {
  const [isPointerLocked, setIsPointerLocked] = useState(false);
  const [ready, setReady] = useState(false);
  const { avatarUrl } = useAvatar();

  // Preload avatar + common animations
  useEffect(() => {
    if (!avatarUrl) return;

    // Preload the main avatar
    useGLTF.preload(avatarUrl);

    // Optional: preload default animations if you have separate files
    const animations = ["idle.glb", "walk.glb", "run.glb", "jump.glb"];
    animations.forEach((file) => useGLTF.preload(`/animations/${file}`));

    // Small delay to prevent first-frame GPU crash
    const timeout = setTimeout(() => setReady(true), 200);
    return () => clearTimeout(timeout);
  }, [avatarUrl]);

  // Pointer lock + keyboard prevent default
  useEffect(() => {
    const handlePointerLockChange = () => {
      setIsPointerLocked(document.pointerLockElement !== null);
    };

    const handleKeyDown = (e) => {
      if (["w","a","s","d","W","A","S","D"].includes(e.key) || e.code === "Space") {
        e.preventDefault();
      }
    };

    const handleKeyUp = handleKeyDown;

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("keydown", handleKeyDown, true);
    document.addEventListener("keyup", handleKeyUp, true);

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("keydown", handleKeyDown, true);
      document.removeEventListener("keyup", handleKeyUp, true);
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
      {!ready && <GameLoader />}

      {!isPointerLocked && ready && (
        <div style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          color: "white",
          background: "rgba(0,0,0,0.7)",
          padding: "10px",
          borderRadius: "5px",
          fontSize: "14px",
          zIndex: 1000,
        }}>
          Click to enable mouse look<br/>
          WASD: Move | Shift: Run | Space: Jump | ESC: Release mouse<br/>
          🌐 Multiplayer Ready
        </div>
      )}

      <KeyboardControls map={keyMap}>
        <Canvas
          shadows
          camera={{ position: [0, 10, 20], fov: 30 }}
          onCreated={(state) => { state.gl.domElement.tabIndex = 1; }}
        >
          <DynamicSky useCustomHDRI={true} />
          {/* <Rain count={18000} /> */}

          <Physics gravity={[0, -9.81, 0]}>
            <CityScene />
            {avatarUrl && (
              <CharacterController userId={userId} onReady={() => setReady(true)} />
            )}
          </Physics>
        </Canvas>
      </KeyboardControls>
    </div>
  );
}
