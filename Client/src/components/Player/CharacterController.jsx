import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, CapsuleCollider } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import * as THREE from 'three'
import { Vector3, Raycaster } from "three";
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
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED, MOUSE_SENSITIVITY, CAMERA_DISTANCE, CAMERA_HEIGHT, CAMERA_COLLISION_RADIUS } =
    useControls("Character", {
      WALK_SPEED: { value: 3.5, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 8.0, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: { value: 15, min: 1, max: 30, step: 1 },
      MOUSE_SENSITIVITY: { value: 0.002, min: 0.0001, max: 0.01, step: 0.0001 },
      CAMERA_DISTANCE: { value: 8, min: 2, max: 20, step: 0.1 },
      CAMERA_HEIGHT: { value: 3, min: 0.5, max: 10, step: 0.1 },
      CAMERA_COLLISION_RADIUS: { value: 0.3, min: 0.1, max: 1, step: 0.05 }
    });

  const rb = useRef();
  const character = useRef();
  const groundRaycaster = useRef(new Raycaster());
  const cameraRaycaster = useRef(new Raycaster());
  const [animation, setAnimation] = useState("idle");
  const [isJumping, setIsJumping] = useState(false);

  const cameraRotationX = useRef(0);
  const cameraRotationY = useRef(0);
  const isPointerLocked = useRef(false);
  const [, get] = useKeyboardControls();
  const jumpVelocity = 5;

  // Ground detection parameters
  const RAYCAST_DISTANCE = 1.2; // Distance to cast ray downwards
  const GROUND_THRESHOLD = 0.1; // How close to ground to consider "grounded"
  const prevJumpPressed = useRef(false);

  // --- Pointer lock ---
  // --- Pointer lock & fullscreen ---
useEffect(() => {
  const handlePointerLockChange = () => { 
    isPointerLocked.current = document.pointerLockElement !== null; 
  };

  const handleMouseMove = (e) => {
    if (!isPointerLocked.current) return;
    cameraRotationY.current -= e.movementX * MOUSE_SENSITIVITY;
    cameraRotationX.current -= e.movementY * MOUSE_SENSITIVITY;
    cameraRotationX.current = Math.max(-Math.PI / 3, Math.min(Math.PI / 4, cameraRotationX.current));
  };

  const handleDoubleClick = () => {
    // Pointer lock
    if (!isPointerLocked.current) {
      document.body.requestPointerLock();
    }

    // Fullscreen
    if (!document.fullscreenElement) {
      if (document.body.requestFullscreen) document.body.requestFullscreen();
      else if (document.body.webkitRequestFullscreen) document.body.webkitRequestFullscreen();
      else if (document.body.msRequestFullscreen) document.body.msRequestFullscreen();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      document.exitPointerLock();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    }
  };

  document.addEventListener("pointerlockchange", handlePointerLockChange);
  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("dblclick", handleDoubleClick);
  document.addEventListener("keydown", handleKeyDown);

  return () => {
    document.removeEventListener("pointerlockchange", handlePointerLockChange);
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("dblclick", handleDoubleClick);
    document.removeEventListener("keydown", handleKeyDown);
  };
}, [MOUSE_SENSITIVITY]);


  // --- Ground detection function ---
  const checkGrounded = (characterPos, scene) => {
    // Cast ray downward from character position
    const rayOrigin = new Vector3(characterPos.x, characterPos.y + 0.1, characterPos.z);
    const rayDirection = new Vector3(0, -1, 0);
    
    groundRaycaster.current.set(rayOrigin, rayDirection);
    groundRaycaster.current.far = RAYCAST_DISTANCE;
    
    const intersections = groundRaycaster.current.intersectObjects(scene.children, true);
    
    // Filter out the character itself
    const validIntersections = intersections.filter(intersection => {
      let obj = intersection.object;
      while (obj) {
        if (obj === character.current) return false;
        obj = obj.parent;
      }
      return true;
    });
    
    if (validIntersections.length > 0) {
      const groundDistance = validIntersections[0].distance;
      return groundDistance <= GROUND_THRESHOLD;
    }
    
    return false;
  };

  // --- Camera collision detection function ---
  const getCameraPositionWithCollision = (characterPos, idealCameraPos, scene) => {
    const direction = new Vector3().subVectors(idealCameraPos, characterPos).normalize();
    const distance = characterPos.distanceTo(idealCameraPos);
    
    // Cast ray from character to ideal camera position
    cameraRaycaster.current.set(characterPos, direction);
    cameraRaycaster.current.far = distance;
    
    const intersections = cameraRaycaster.current.intersectObjects(scene.children, true);
    
    // Filter out the character itself and other non-collision objects
    const validIntersections = intersections.filter(intersection => {
      let obj = intersection.object;
      while (obj) {
        if (obj === character.current) return false;
        obj = obj.parent;
      }
      return true;
    });
    
    if (validIntersections.length > 0) {
      const closestIntersection = validIntersections[0];
      const adjustedDistance = Math.max(
        closestIntersection.distance - CAMERA_COLLISION_RADIUS,
        1 // Minimum distance to prevent camera from getting too close
      );
      
      // Calculate new camera position
      const adjustedCameraPos = new Vector3()
        .copy(characterPos)
        .add(direction.multiplyScalar(adjustedDistance));
      
      return adjustedCameraPos;
    }
    
    return idealCameraPos;
  };

  // --- Camera smoothing ref ---
  const cameraDistanceRef = useRef(CAMERA_DISTANCE);

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

    // --- Check if character is grounded using raycasting ---
    const characterPos = rb.current.translation();
    const isGrounded = checkGrounded(characterPos, scene);

    // --- Horizontal movement ---
    if (moveVector.lengthSq() > 0) {
      moveVector.normalize();
      const speed = run ? RUN_SPEED : WALK_SPEED;
      vel.x = moveVector.x * speed;
      vel.z = moveVector.z * speed;
      
      // Only change animation to walk/run if not jumping or if grounded
      if (!isJumping || isGrounded) {
        setAnimation(run ? "run" : "walk");
      }
      
      const targetRotation = Math.atan2(moveVector.x, moveVector.z);
      character.current.rotation.y = lerpAngle(character.current.rotation.y, targetRotation, ROTATION_SPEED * delta);
    } else if (!isJumping || isGrounded) {
      setAnimation("idle");
    }

    // --- Jump logic with proper ground detection ---
    if (jump && !prevJumpPressed.current && isGrounded) {
      vel.y = jumpVelocity;
      setIsJumping(true);
      setAnimation("jump");
    }
    prevJumpPressed.current = jump;

    // --- Landing detection ---
    if (isJumping && isGrounded && rb.current.linvel().y <= 0.1) {
      setIsJumping(false);
      // Determine animation after landing
      if (moveVector.lengthSq() > 0) {
        setAnimation(run ? "run" : "walk");
      } else {
        setAnimation("idle");
      }
    }

    rb.current.setLinvel(vel, true);

    // --- Sync model to physics ---
    const pos = rb.current.translation();
    character.current.position.set(pos.x, pos.y, pos.z);

    // --- Camera with collision detection ---
    const characterPosition = new Vector3(pos.x, pos.y + 1.5, pos.z);

    // Direction vector from character to camera
    const camX = Math.sin(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camY = Math.sin(cameraRotationX.current);
    const camZ = Math.cos(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camDirVector = new Vector3(camX, camY, camZ).normalize();

    const idealCameraPos = new Vector3().addVectors(
      characterPosition,
      camDirVector.clone().multiplyScalar(CAMERA_DISTANCE)
    );

    const finalCameraPos = getCameraPositionWithCollision(characterPosition, idealCameraPos, scene);
    const targetDistance = characterPosition.distanceTo(finalCameraPos);

    // --- Smooth distance interpolation only ---
    cameraDistanceRef.current = THREE.MathUtils.lerp(
      cameraDistanceRef.current,
      targetDistance,
      10 * delta
    );

    const smoothCameraPos = new Vector3().addVectors(
      characterPosition,
      camDirVector.clone().multiplyScalar(cameraDistanceRef.current)
    );

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