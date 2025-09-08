// hooks/useMultiplayerSync.js
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const useMultiplayerSync = (
  rb,
  character,
  animation,
  avatarUrl,
  sendPlayerUpdate,
  connected
) => {
  const updateThrottleRef = useRef(0);

  useFrame((_, delta) => {
    if (!rb.current || !character.current || !connected) return;

    updateThrottleRef.current += delta;
    if (updateThrottleRef.current >= 1 / 20) {
      const pos = rb.current.translation();
      sendPlayerUpdate(
        pos.x,
        pos.y,
        pos.z,
        character.current.rotation.y,
        animation,
        avatarUrl
      );
      updateThrottleRef.current = 0;
    }
  });
};
