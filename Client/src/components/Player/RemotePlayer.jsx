import React, { useRef, useEffect } from "react";
import { Vector3 } from "three";
import Avatar from "./Avatar";

export default function RemotePlayer({ player }) {
  const group = useRef();
  const targetPos = new Vector3();

  useEffect(() => {
    const id = setInterval(() => {
      if (!group.current) return;
      targetPos.set(player.x, player.y, player.z);
      group.current.position.lerp(targetPos, 0.2);
      group.current.rotation.y += (player.rotY - group.current.rotation.y) * 0.2;
    }, 50);

    return () => clearInterval(id);
  }, [player]);

  return (
    <group ref={group}>
      <Avatar scale={1} currentAction={player.anim} />
    </group>
  );
}
