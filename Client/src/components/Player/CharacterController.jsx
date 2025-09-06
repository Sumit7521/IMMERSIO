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
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, MOUSE_SENSITIVITY } =
    useControls("Character", {
      WALK_SPEED: { value: 2.5, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 5.0, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: { value: 15, min: 1, max: 30, step: 1 },
      MOUSE_SENSITIVITY: { value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 }
    });

  const rb = useRef();
  const character = useRef();
  const [animation, setAnimation] = useState("idle");
  const [isJumping, setIsJumping] = useState(false);

  const cameraRotationX = useRef(0);
  const cameraRotationY = useRef(0);
  const isPointerLocked = useRef(false);
  const [, get] = useKeyboardControls();
  const jumpVelocity = 5;

  // --- Pointer lock ---
  useEffect(() => {
    const handlePointerLockChange = () => { isPointerLocked.current = document.pointerLockElement !== null; };
    const handleMouseMove = (e) => {
      if (!isPointerLocked.current) return;
      cameraRotationY.current -= e.movementX * MOUSE_SENSITIVITY;
      cameraRotationX.current -= e.movementY * MOUSE_SENSITIVITY;
      cameraRotationX.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 4, cameraRotationX.current));
    };
    const handleClick = () => { if (!isPointerLocked.current) document.body.requestPointerLock(); };
    const handleKeyDown = (e) => { if (e.key === "Escape") document.exitPointerLock(); };

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

  // --- Movement + Physics ---
  useFrame((state, delta) => {
    if (!rb.current || !character.current) return;

    const { camera } = state;
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

    // --- Horizontal movement ---
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      const speed = run ? RUN_SPEED : WALK_SPEED;
      vel.x = moveVector.x * speed;
      vel.z = moveVector.z * speed;
      if (!isJumping) setAnimation(run ? "run" : "walk");
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      character.current.rotation.y = lerpAngle(character.current.rotation.y, targetRotation, ROTATION_SPEED * delta);
    } else if (!isJumping) {
      setAnimation("idle");
    }

    // --- Jump logic ---
    const onGround = Math.abs(rb.current.linvel().y) < 0.01;
    if (jump && onGround) {
      vel.y = jumpVelocity;
      setIsJumping(true);
      setAnimation("jump");
    }

    // --- Detect landing ---
    if (isJumping && onGround) {
      setIsJumping(false);
      // Return to walk or idle depending on movement keys
      if (moveVector.lengthSq() > 0) setAnimation(run ? "run" : "walk");
      else setAnimation("idle");
    }

    rb.current.setLinvel(vel, true);

    // --- Sync model to physics ---
    const pos = rb.current.translation();
    character.current.position.set(pos.x, pos.y, pos.z);

    // --- Camera ---
    const distance = 8, height = 3;
    const camX = Math.sin(cameraRotationY.current) * Math.cos(cameraRotationX.current) * distance;
    const camY = Math.sin(cameraRotationX.current) * distance + height;
    const camZ = Math.cos(cameraRotationY.current) * Math.cos(cameraRotationX.current) * distance;
    camera.position.copy(new Vector3(pos.x + camX, pos.y + camY, pos.z + camZ));
    camera.lookAt(pos.x, pos.y + 1.5, pos.z);
  });

  return (
    <>
      <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
        <CapsuleCollider args={[0.7, 0.5]} position={[0, 1.2, 0]} />
      </RigidBody>
      <group ref={character}>
        <Avatar scale={1} currentAction={animation} />
      </group>
    </>
  );
};
