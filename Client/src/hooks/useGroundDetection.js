import { useRef } from "react";
import { Vector3, Raycaster } from "three";

export const useGroundDetection = (characterRef, distance = 1.2, threshold = 0.1) => {
  const groundRaycaster = useRef(new Raycaster());

  const checkGrounded = (characterPos, scene) => {
    const rayOrigin = new Vector3(characterPos.x, characterPos.y + 0.1, characterPos.z);
    const rayDirection = new Vector3(0, -1, 0);

    groundRaycaster.current.set(rayOrigin, rayDirection);
    groundRaycaster.current.far = distance;

    const intersections = groundRaycaster.current.intersectObjects(scene.children, true);
    const valid = intersections.filter(intersection => {
      let obj = intersection.object;
      while (obj) {
        if (obj === characterRef.current) return false;
        obj = obj.parent;
      }
      return true;
    });

    return valid.length > 0 && valid[0].distance <= threshold;
  };

  return { checkGrounded };
};
