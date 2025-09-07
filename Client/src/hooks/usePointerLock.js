import { useEffect, useRef } from "react";

export const usePointerLock = (MOUSE_SENSITIVITY) => {
  const cameraRotationX = useRef(0);
  const cameraRotationY = useRef(0);
  const isPointerLocked = useRef(false);

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
      if (!isPointerLocked.current) {
        document.body.requestPointerLock();
      }
      if (!document.fullscreenElement) {
        document.body.requestFullscreen?.();
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        document.exitPointerLock();
        document.exitFullscreen?.();
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

  return { cameraRotationX, cameraRotationY };
};
