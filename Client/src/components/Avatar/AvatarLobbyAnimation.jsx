// src/components/AvatarLobbyAnimation.jsx
import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

const AvatarModel = ({ url, position, rotation, scale }) => {
  // Load avatar
  const { scene: avatarScene } = useGLTF(url);

  // Load animation GLB
  const { animations } = useGLTF("/animations/F_Standing_Idle_Variations_001.glb");

  // Clone avatar skeleton for animation retargeting
  const avatarClone = SkeletonUtils.clone(avatarScene);

  // Bind animations to avatar
  const { actions } = useAnimations(animations, avatarClone);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const idle = actions[Object.keys(actions)[0]];
      idle.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return <primitive object={avatarClone} position={position} rotation={rotation} scale={scale} />;
};

const AvatarLobbyAnimation = ({ avatarUrl, posX, posY, posZ, rotX, rotY, rotZ, scale }) => {
  if (!avatarUrl) return <p className="text-gray-400">No avatar to display</p>;

  return (
    <Canvas camera={{ position: [0, 1.5, 3], fov: 75 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 5, 5]} intensity={1} />

      <AvatarModel
        url={avatarUrl}
        position={[posX, posY, posZ]}
        rotation={[rotX, rotY, rotZ]}
        scale={scale}
      />

      {/* Orbit controls restricted to Y axis only */}
      <OrbitControls
        enableZoom={false}      // ❌ disable zoom
        enablePan={false}       // ❌ disable panning
        minPolarAngle={Math.PI / 2} // lock vertical rotation
        maxPolarAngle={Math.PI / 2} // lock vertical rotation
      />
    </Canvas>
  );
};

export default AvatarLobbyAnimation;
