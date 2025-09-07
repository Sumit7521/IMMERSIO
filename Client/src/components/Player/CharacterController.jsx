import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import { useControls } from "leva";
import { Vector3 } from "three";
import Avatar from "./Avatar";

import { usePointerLock } from "../../hooks/usePointerLock";
import { useGroundDetection } from "../../hooks/useGroundDetection";
import { useCameraCollision } from "../../hooks/useCameraCollision";
import { useCharacterAnimation } from "../../hooks/useCharacterAnimation";
import { lerpAngle } from "../../hooks/utils";

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, MOUSE_SENSITIVITY, CAMERA_DISTANCE, CAMERA_COLLISION_RADIUS } =
    useControls("Character", {
      WALK_SPEED: { value: 3.5, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 8.0, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: { value: 15, min: 1, max: 30, step: 1 },
      MOUSE_SENSITIVITY: { value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 },
      CAMERA_DISTANCE: { value: 8, min: 2, max: 20, step: 0.1 },
      CAMERA_COLLISION_RADIUS: { value: 0.3, min: 0.1, max: 1, step: 0.05 }
    });

  const rb = useRef();
  const character = useRef();
  const [, get] = useKeyboardControls();

  const { cameraRotationX, cameraRotationY } = usePointerLock(MOUSE_SENSITIVITY);
  const { checkGrounded } = useGroundDetection(character);
  const { getCameraPositionWithCollision, smoothCameraPosition } = useCameraCollision(character, CAMERA_DISTANCE, CAMERA_COLLISION_RADIUS);
  const { animation, setAnimation, isJumping, setIsJumping } = useCharacterAnimation();

  const jumpVelocity = 5;
  const prevJumpPressed = useRef(false);

  useFrame((state, delta) => {
    if (!rb.current || !character.current) return;

    const { camera, scene } = state;
    const vel = { x: 0, y: rb.current.linvel().y, z: 0 };
    const { forward, backward, left, right, run, jump } = get();

    const camDir = new Vector3();
    camera.getWorldDirection(camDir).setY(0).normalize();
    const camRight = new Vector3().crossVectors(new Vector3(0, 1, 0), camDir).normalize();

    let moveVector = new Vector3();
    if (forward) moveVector.add(camDir);
    if (backward) moveVector.sub(camDir);
    if (left) moveVector.add(camRight);
    if (right) moveVector.sub(camRight);

    const characterPos = rb.current.translation();
    const isGrounded = checkGrounded(characterPos, scene);

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      const speed = run ? RUN_SPEED : WALK_SPEED;
      vel.x = moveVector.x * speed;
      vel.z = moveVector.z * speed;

      if (!isJumping || isGrounded) setAnimation(run ? "run" : "walk");
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      character.current.rotation.y = lerpAngle(character.current.rotation.y, targetRotation, ROTATION_SPEED * delta);
    } else if (!isJumping || isGrounded) {
      setAnimation("idle");
    }

    if (jump && !prevJumpPressed.current && isGrounded) {
      vel.y = jumpVelocity;
      setIsJumping(true);
      setAnimation("jump");
    }
    prevJumpPressed.current = jump;

    if (isJumping && isGrounded && rb.current.linvel().y <= 0.1) {
      setIsJumping(false);
      setAnimation(moveVector.lengthSq() > 0 ? (run ? "run" : "walk") : "idle");
    }

    rb.current.setLinvel(vel, true);

    const pos = rb.current.translation();
    character.current.position.set(pos.x, pos.y, pos.z);

    const characterPosition = new Vector3(pos.x, pos.y + 1.5, pos.z);
    const camX = Math.sin(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camY = Math.sin(cameraRotationX.current);
    const camZ = Math.cos(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camDirVector = new Vector3(camX, camY, camZ).normalize();

    const idealCameraPos = new Vector3().addVectors(characterPosition, camDirVector.clone().multiplyScalar(CAMERA_DISTANCE));
    const finalCameraPos = getCameraPositionWithCollision(characterPosition, idealCameraPos, scene);
    const targetDistance = characterPosition.distanceTo(finalCameraPos);

    const smoothCameraPos = smoothCameraPosition(characterPosition, camDirVector, targetDistance, delta);

    camera.position.copy(smoothCameraPos);
    camera.lookAt(characterPosition);
  });

  return (
    <>
      <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
        <CapsuleCollider args={[0.7, 0.3]} position={[0, 1, 0]} />
      </RigidBody>
      <group ref={character}>
        <Avatar scale={1} currentAction={animation} />
      </group>
    </>
  );
};
