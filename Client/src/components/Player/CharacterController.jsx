// components/Player/CharacterController.js
import React, { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
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

import LocationPopup from "./LocationPopup"; 

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
  const [multiplayerReady, setMultiplayerReady] = React.useState(false);

  const { players, connected, sendPlayerUpdate, sessionId } = useMultiplayer(
    userId,
    avatarUrl || "default"
  );

  const lastPosition = useRef({ x: 0, y: 0, z: 0 });

  // Trigger position for popup
  const triggerPos = { x: 100.15, y: -3.3, z: -5.35 };
  const triggerDistance = 5; // distance threshold

  useEffect(() => {
    if (avatarUrl) setMultiplayerReady(true);
  }, [avatarUrl]);

  const { animation } = useMovement(rb, character, getKeys, settings);
  useCameraFollow(character, settings);
  useMultiplayerSync(rb, character, animation, avatarUrl, sendPlayerUpdate, connected);

  const [playerPos, setPlayerPos] = React.useState({ x: 0, y: 0, z: 0 });

  useFrame(() => {
    if (!rb.current) return;

    const pos = rb.current.translation();

    // --- log only when player moves ---
    const moved =
      pos.x !== lastPosition.current.x ||
      pos.y !== lastPosition.current.y ||
      pos.z !== lastPosition.current.z;

    if (moved) {
      console.log(
        `Player moved to: x=${pos.x.toFixed(2)}, y=${pos.y.toFixed(2)}, z=${pos.z.toFixed(2)}`
      );
      lastPosition.current = { x: pos.x, y: pos.y, z: pos.z };
      setPlayerPos({ x: pos.x, y: pos.y, z: pos.z }); // update position for popup
    }
  });

  return (
    <>
      {/* Local player */}
      <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
        <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
      </RigidBody>
      <group ref={character}>
        <Avatar scale={1} currentAction={animation} avatarUrl={avatarUrl} />
      </group>

      {/* Popup */}
      <LocationPopup
        playerPos={playerPos}
        triggerPos={triggerPos}
        triggerDistance={triggerDistance}
      />

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
