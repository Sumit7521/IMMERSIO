// components/Player/CharacterController.js
import React, { useRef, useEffect, useState } from "react";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import Avatar from "./Avatar";
import RemotePlayer from "./RemotePlayer";

import { useControls } from "leva";
import { useKeyboardControls } from "@react-three/drei";

import { useAvatar } from "../../contexts/AvatarContext";
import { useMultiplayer } from "../../hooks/useMultiplayer";

import { useMovement } from "../../hooks/useMovement";
import { useCameraFollow } from "../../hooks/useCameraFollow";
import { useMultiplayerSync } from "../../hooks/useMultiplayerSync";

export const CharacterController = ({ userId = "guest" }) => {
  const settings = useControls("Character", {
    WALK_SPEED: { value: 3.5, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 8.0, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: { value: 15, min: 1, max: 30, step: 1 },
    MOUSE_SENSITIVITY: { value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 },
    CAMERA_DISTANCE: { value: 8, min: 2, max: 20, step: 0.1 },
    CAMERA_COLLISION_RADIUS: { value: 0.3, min: 0.1, max: 1, step: 0.05 },
  });

  const rb = useRef();
  const character = useRef();
  const [, getKeys] = useKeyboardControls();

  const { avatarUrl } = useAvatar();
  const [multiplayerReady, setMultiplayerReady] = useState(false);
  console.log(multiplayerReady)

  const { players, connected, sendPlayerUpdate, sessionId } = useMultiplayer(
    userId,
    avatarUrl || "default"
  );

  useEffect(() => {
    if (avatarUrl) setMultiplayerReady(true);
  }, [avatarUrl]);

  // ✅ Movement
  const { animation } = useMovement(rb, character, getKeys, settings);

  // ✅ Camera follow
  useCameraFollow(character, settings);

  // ✅ Multiplayer sync
  useMultiplayerSync(rb, character, animation, avatarUrl, sendPlayerUpdate, connected);

  return (
    <>
      {/* Local player */}
      <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
        <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
      </RigidBody>
      <group ref={character}>
        <Avatar scale={1} currentAction={animation} avatarUrl={avatarUrl} />
      </group>

      {/* Remote players */}
      {connected &&
        Array.from(players.values()).map((player) => {
          if (player.sessionId === sessionId) return null;
          return (
            <RemotePlayer
              key={player.sessionId}
              player={player}
              avatarUrl={player.avatarUrl}
            />
          );
        })}
    </>
  );
};
