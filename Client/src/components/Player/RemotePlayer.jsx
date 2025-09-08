import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import Avatar from './Avatar';
import { Vector3 } from 'three';

const RemotePlayer = ({ player }) => {
  const groupRef = useRef();
  const targetPosition = useRef(new Vector3());
  const targetRotation = useRef(0);

  useEffect(() => {
    if (player) {
      targetPosition.current.set(player.x, player.y, player.z);
      targetRotation.current = player.rotationY;
    }
  }, [player.x, player.y, player.z, player.rotationY]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Smooth interpolation for position
    const currentPos = groupRef.current.position;
    currentPos.lerp(targetPosition.current, delta * 10);

    // Smooth interpolation for rotation
    const currentRot = groupRef.current.rotation.y;
    const rotDiff = targetRotation.current - currentRot;
    const shortestAngle = ((rotDiff % (Math.PI * 2)) + (Math.PI * 3)) % (Math.PI * 2) - Math.PI;
    groupRef.current.rotation.y += shortestAngle * delta * 10;
  });

  return (
    <group ref={groupRef}>
      <Avatar 
        scale={1} 
        currentAction={player.animation} 
        avatarUrl={player.avatarUrl} // ✅ remote avatar URL
      />

      {/* Optional: Add username display above player */}
      {/* <mesh position={[0, 3, 0]}>
        <planeGeometry args={[2, 0.5]} />
        <meshBasicMaterial color="white" transparent opacity={0.8} />
      </mesh> */}
    </group>
  );
};

export default RemotePlayer;
