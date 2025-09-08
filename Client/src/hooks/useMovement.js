// hooks/useMovement.js
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Vector3 } from "three";
import { lerpAngle } from "./utils";
import { useGroundDetection } from "./useGroundDetection";
import { useCharacterAnimation } from "./useCharacterAnimation";

export const useMovement = (rb, character, getKeys, settings) => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = settings;
  const { checkGrounded } = useGroundDetection(character);
  const { animation, setAnimation, isJumping, setIsJumping } =
    useCharacterAnimation();

  const prevJumpPressed = useRef(false);

  useFrame((state, delta) => {
    if (!rb.current || !character.current) return;

    const { scene, camera } = state;
    const vel = { x: 0, y: rb.current.linvel().y, z: 0 };
    const { forward, backward, left, right, run, jump } = getKeys();

    const camDir = new Vector3();
    camera.getWorldDirection(camDir).setY(0).normalize();
    const camRight = new Vector3()
      .crossVectors(new Vector3(0, 1, 0), camDir)
      .normalize();

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
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        targetRotation,
        ROTATION_SPEED * delta
      );
    } else if (!isJumping || isGrounded) {
      setAnimation("idle");
    }

    // Jump
    if (jump && !prevJumpPressed.current && isGrounded) {
      vel.y = 5;
      setIsJumping(true);
      setAnimation("jump");
    }
    prevJumpPressed.current = jump;

    if (isJumping && isGrounded && rb.current.linvel().y <= 0.1) {
      setIsJumping(false);
      setAnimation(
        moveVector.lengthSq() > 0 ? (run ? "run" : "walk") : "idle"
      );
    }

    rb.current.setLinvel(vel, true);
    const pos = rb.current.translation();
    character.current.position.set(pos.x, pos.y, pos.z);
  });

  return { animation };
};
