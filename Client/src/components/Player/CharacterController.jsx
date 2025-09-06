import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import Avatar from "./Avatar";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);
  if (Math.abs(end - start) > Math.PI) {
    if (end > start) start += 2 * Math.PI;
    else end += 2 * Math.PI;
  }
  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, CAMERA_SMOOTHING, MOUSE_SENSITIVITY } =
    useControls("Character", {
      WALK_SPEED: { value: 2.5, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 5.0, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: { value: 15, min: 1, max: 30, step: 1 },
      CAMERA_SMOOTHING: { value: 0.1, min: 0.01, max: 0.3, step: 0.01 },
      MOUSE_SENSITIVITY: { value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 }
    });

  const rb = useRef();
  const character = useRef(); // Ref for the visual model group

  const [animation, setAnimation] = useState("idle");

  const cameraRotationX = useRef(0);
  const cameraRotationY = useRef(0);
  const isPointerLocked = useRef(false);

  const [, get] = useKeyboardControls();

  useEffect(() => {
    // This useEffect for pointer lock controls remains the same
    const handlePointerLockChange = () => { isPointerLocked.current = document.pointerLockElement !== null; };
    const handleMouseMove = (event) => {
      if (!isPointerLocked.current) return;
      cameraRotationY.current -= event.movementX * MOUSE_SENSITIVITY;
      cameraRotationX.current -= event.movementY * MOUSE_SENSITIVITY;
      cameraRotationX.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 4, cameraRotationX.current));
    };
    const handleClick = () => { if (!isPointerLocked.current) document.body.requestPointerLock(); };
    const handleKeyDown = (event) => { if (event.key === "Escape") document.exitPointerLock(); };
    document.addEventListener("pointerlockchange", handlePointerLockChange);
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [MOUSE_SENSITIVITY]);

  useFrame((state, delta) => {
    if (!rb.current || !character.current) return;

    // --- Physics and Movement Calculation ---
    const { camera } = state;
    const vel = { x: 0, y: rb.current.linvel().y, z: 0 };
    const { forward, backward, left, right, run } = get();

    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection).setY(0).normalize();
    const cameraRight = new Vector3().crossVectors(new Vector3(0, 1, 0), cameraDirection).normalize();

    let moveVector = new Vector3();
    if (forward) moveVector.add(cameraDirection);
    if (backward) moveVector.sub(cameraDirection);
    if (left) moveVector.add(cameraRight);
    if (right) moveVector.sub(cameraRight);

    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      const speed = run ? RUN_SPEED : WALK_SPEED;
      vel.x = moveVector.x * speed;
      vel.z = moveVector.z * speed;
      setAnimation(run ? "run" : "walk");

      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      character.current.rotation.y = lerpAngle(character.current.rotation.y, targetRotation, ROTATION_SPEED * delta);
    } else {
      setAnimation("idle");
    }
    rb.current.setLinvel(vel, true);

    // --- Manual Synchronization ---
    const charPos = rb.current.translation();
    character.current.position.set(charPos.x, charPos.y, charPos.z);

    // --- Camera Logic ---
    const distance = 8;
    const height = 3;
    const cameraX = Math.sin(cameraRotationY.current) * Math.cos(cameraRotationX.current) * distance;
    const cameraY = Math.sin(cameraRotationX.current) * distance + height;
    const cameraZ = Math.cos(cameraRotationY.current) * Math.cos(cameraRotationX.current) * distance;

    const targetCameraPos = new Vector3(charPos.x + cameraX, charPos.y + cameraY, charPos.z + cameraZ);

    // CHANGED: Replaced .lerp() with .copy() for an instant camera movement test
    camera.position.copy(targetCameraPos);

    camera.lookAt(charPos.x, charPos.y + 1.5, charPos.z);
  });

  return (
    <>
      {/* Physics Body: Contains only the collider */}
      <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
        <CapsuleCollider args={[0.7, 0.5]} position={[0, 1.2, 0]} />
      </RigidBody>

      {/* Visual Model: Synced manually to the physics body */}
      <group ref={character}>
        <Avatar scale={1} currentAction={animation} />
      </group>
    </>
  );
};