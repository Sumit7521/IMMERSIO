import { useRef } from "react";
import { Vector3, Raycaster, MathUtils } from "three";

export const useCameraCollision = (characterRef, CAMERA_DISTANCE, CAMERA_COLLISION_RADIUS) => {
  const cameraRaycaster = useRef(new Raycaster());
  const cameraDistanceRef = useRef(CAMERA_DISTANCE);

  const getCameraPositionWithCollision = (characterPos, idealCameraPos, scene) => {
    const direction = new Vector3().subVectors(idealCameraPos, characterPos).normalize();
    const distance = characterPos.distanceTo(idealCameraPos);

    cameraRaycaster.current.set(characterPos, direction);
    cameraRaycaster.current.far = distance;

    const intersections = cameraRaycaster.current.intersectObjects(scene.children, true);
    const valid = intersections.filter(intersection => {
      let obj = intersection.object;
      while (obj) {
        if (obj === characterRef.current) return false;
        obj = obj.parent;
      }
      return true;
    });

    if (valid.length > 0) {
      const closest = valid[0];
      const adjustedDistance = Math.max(closest.distance - CAMERA_COLLISION_RADIUS, 1);
      return new Vector3().copy(characterPos).add(direction.multiplyScalar(adjustedDistance));
    }

    return idealCameraPos;
  };

  const smoothCameraPosition = (characterPosition, camDirVector, targetDistance, delta) => {
    cameraDistanceRef.current = MathUtils.lerp(cameraDistanceRef.current, targetDistance, 10 * delta);
    return new Vector3().addVectors(
      characterPosition,
      camDirVector.clone().multiplyScalar(cameraDistanceRef.current)
    );
  };

  return { getCameraPositionWithCollision, smoothCameraPosition };
};
