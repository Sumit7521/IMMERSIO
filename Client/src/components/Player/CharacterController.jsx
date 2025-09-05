import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useControls } from "leva";
import { useRef, useState } from "react";
import { Vector3, Euler } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
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
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, CAMERA_SMOOTHING } = useControls("Character", {
    WALK_SPEED: { value: 2.5, min: 0.1, max: 4, step: 0.1 },
    RUN_SPEED: { value: 5.0, min: 0.2, max: 12, step: 0.1 },
    ROTATION_SPEED: { value: degToRad(180), min: degToRad(90), max: degToRad(360), step: degToRad(10) },
    CAMERA_SMOOTHING: { value: 0.05, min: 0.01, max: 0.2, step: 0.01 }
  });

  const rb = useRef();
  const container = useRef();
  const character = useRef();

  const [animation, setAnimation] = useState("idle");
  const characterRotationTarget = useRef(0);

  const [, get] = useKeyboardControls();

  useFrame((state, delta) => {
    if (!rb.current || !character.current) return;

    const { camera } = state;
    const vel = rb.current.linvel();
    
    // Get input
    const forward = get().forward;
    const backward = get().backward;
    const left = get().left;
    const right = get().right;
    const run = get().run;

    // Get camera direction for relative movement
    const cameraDirection = new Vector3();
    camera.getWorldDirection(cameraDirection);
    cameraDirection.y = 0; // Remove vertical component
    cameraDirection.normalize();

    // Get camera right vector
    const cameraRight = new Vector3();
    cameraRight.crossVectors(cameraDirection, camera.up).normalize();

    // Calculate movement direction relative to camera
    let moveVector = new Vector3(0, 0, 0);
    
    if (forward) moveVector.add(cameraDirection);
    if (backward) moveVector.sub(cameraDirection);
    if (left) moveVector.sub(cameraRight);
    if (right) moveVector.add(cameraRight);

    // Normalize diagonal movement
    if (moveVector.length() > 0) {
      moveVector.normalize();
    }

    const speed = run ? RUN_SPEED : WALK_SPEED;
    const isMoving = moveVector.length() > 0;

    if (isMoving) {
      // Calculate target rotation based on movement direction
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      
      // Smoothly rotate character towards movement direction
      characterRotationTarget.current = lerpAngle(
        characterRotationTarget.current, 
        targetRotation, 
        ROTATION_SPEED * delta
      );

      // Apply movement in world space
      vel.x = moveVector.x * speed;
      vel.z = moveVector.z * speed;
      
      // Set appropriate animation
      setAnimation(run ? "run" : "walk");
    } else {
      // Stop movement when no input
      vel.x = 0;
      vel.z = 0;
      setAnimation("idle");
    }

    // Smooth character rotation
    character.current.rotation.y = lerpAngle(
      character.current.rotation.y, 
      characterRotationTarget.current, 
      0.15
    );

    // Apply velocity
    rb.current.setLinvel(vel, true);

    // Smooth camera follow
    const charPos = rb.current.translation();
    const characterRotation = new Euler(0, character.current.rotation.y, 0);
    
    // Camera offset relative to character rotation
    const cameraOffset = new Vector3(0, 5, -8);
    cameraOffset.applyEuler(characterRotation);
    
    const targetCameraPos = new Vector3(
      charPos.x + cameraOffset.x,
      charPos.y + cameraOffset.y,
      charPos.z + cameraOffset.z
    );

    // Smooth camera movement
    camera.position.lerp(targetCameraPos, CAMERA_SMOOTHING);
    
    // Look at character with slight offset
    const lookAtTarget = new Vector3(charPos.x, charPos.y + 1.5, charPos.z);
    camera.lookAt(lookAtTarget);
  });

  return (
    <RigidBody colliders={false} lockRotations ref={rb} position={[0, 2, 0]}>
      <group ref={container}>
        <group ref={character}>
          <Avatar scale={1} currentAction={animation} />
        </group>
      </group>
      <CapsuleCollider args={[0.7, 0.5]} position={[0, 1.2, 0]} />
    </RigidBody>
  );
};