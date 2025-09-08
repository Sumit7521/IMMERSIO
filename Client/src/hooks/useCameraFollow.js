// hooks/useCameraFollow.js
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";
import { usePointerLock } from "./usePointerLock";
import { useCameraCollision } from "./useCameraCollision";

export const useCameraFollow = (character, settings) => {
  const { CAMERA_DISTANCE, CAMERA_COLLISION_RADIUS, MOUSE_SENSITIVITY } =
    settings;

  const { cameraRotationX, cameraRotationY } = usePointerLock(MOUSE_SENSITIVITY);
  const { getCameraPositionWithCollision, smoothCameraPosition } =
    useCameraCollision(character, CAMERA_DISTANCE, CAMERA_COLLISION_RADIUS);

  useFrame((state, delta) => {
    if (!character.current) return;
    const { camera, scene } = state;

    const pos = character.current.position.clone();
    const characterPosition = new Vector3(pos.x, pos.y + 1.5, pos.z);

    const camX =
      Math.sin(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camY = Math.sin(cameraRotationX.current);
    const camZ =
      Math.cos(cameraRotationY.current) * Math.cos(cameraRotationX.current);
    const camDirVector = new Vector3(camX, camY, camZ).normalize();

    const idealCameraPos = new Vector3().addVectors(
      characterPosition,
      camDirVector.clone().multiplyScalar(CAMERA_DISTANCE)
    );
    const finalCameraPos = getCameraPositionWithCollision(
      characterPosition,
      idealCameraPos,
      scene
    );
    const targetDistance = characterPosition.distanceTo(finalCameraPos);

    const smoothCameraPos = smoothCameraPosition(
      characterPosition,
      camDirVector,
      targetDistance,
      delta
    );

    camera.position.copy(smoothCameraPos);
    camera.lookAt(characterPosition);
  });
};
