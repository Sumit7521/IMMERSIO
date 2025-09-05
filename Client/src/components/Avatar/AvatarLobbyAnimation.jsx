import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF, useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";

// Avatar Model Component
const AvatarModel = ({ url, position, rotation, scale }) => {
  const { scene: avatarScene } = useGLTF(url);
  const { animations } = useGLTF("/animations/idle.glb");

  // Memoize the cloned avatar to prevent re-cloning on each render
  const avatarClone = useMemo(() => SkeletonUtils.clone(avatarScene), [avatarScene]);

  const { actions } = useAnimations(animations, avatarClone);

  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      const idle = actions[Object.keys(actions)[0]];
      idle.reset().fadeIn(0.5).play();
    }
  }, [actions]);

  return <primitive object={avatarClone} position={position} rotation={rotation} scale={scale} />;
};

// Camera Controller Component
const CameraController = ({ camX, camY, camZ, camRotX, camRotY, camRotZ, fov }) => {
  const cameraRef = useRef();

  useFrame(() => {
    if (cameraRef.current) {
      cameraRef.current.position.set(camX, camY, camZ);
      cameraRef.current.rotation.set(camRotX, camRotY, camRotZ);
      cameraRef.current.fov = fov;
      cameraRef.current.updateProjectionMatrix();
    }
  });

  return <perspectiveCamera ref={cameraRef} />;
};

// Main Animation Component
const AvatarLobbyAnimation = React.memo(
  ({ avatarUrl, avatarControls, cameraControls, lightControls }) => {
    return (
      <Canvas>
        <ambientLight intensity={0.7} />
        <directionalLight position={[0, 5, 5]} intensity={1} />

        {/* Lights */}
        <pointLight
          position={[lightControls.light1X, lightControls.light1Y, lightControls.light1Z]}
          color={lightControls.light1Color}
          intensity={lightControls.light1Intensity}
        />
        <pointLight
          position={[lightControls.light2X, lightControls.light2Y, lightControls.light2Z]}
          color={lightControls.light2Color}
          intensity={lightControls.light2Intensity}
        />

        {/* Avatar */}
        <AvatarModel
          url={avatarUrl}
          position={[avatarControls.posX, avatarControls.posY, avatarControls.posZ]}
          rotation={[avatarControls.rotX, avatarControls.rotY, avatarControls.rotZ]}
          scale={avatarControls.scale}
        />

        {/* Camera */}
        <CameraController {...cameraControls} />

        {/* Orbit Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    );
  }
);

export default AvatarLobbyAnimation;
