import React, { useEffect, useState, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { fetchAvatars } from "../../api/avatar";

export default function Avatar({ currentAction = "idle", scale = 1 }) {
  const [avatarScene, setAvatarScene] = useState(null);
  const [animations, setAnimations] = useState([]);
  const avatarRef = useRef();

  useEffect(() => {
    fetchAvatars()
      .then(async (avatars) => {
        if (!avatars.length) return;

        const url = avatars[0].url;
        const loader = new GLTFLoader();

        // Load avatar model
        const gltf = await loader.loadAsync(url);
        const clonedScene = SkeletonUtils.clone(gltf.scene);
        setAvatarScene(clonedScene);

        // Load animations from public folder
        const animFiles = ["idle.glb", "walk.glb", "run.glb", "jump.glb"];
        const anims = [];

        for (let file of animFiles) {
          const animGltf = await loader.loadAsync(`/animations/${file}`);
          anims.push(...animGltf.animations);
        }

        setAnimations(anims);
      })
      .catch(console.error);
  }, []);

  const { actions } = useAnimations(animations, avatarScene);

  // Switch animations
  useEffect(() => {
    if (!actions) return;

    Object.values(actions).forEach((action) => action.stop());
    if (actions[currentAction]) {
      actions[currentAction].reset().fadeIn(0.2).play();
    }
  }, [currentAction, actions]);

  if (!avatarScene) return null;

  return <primitive ref={avatarRef} object={avatarScene} scale={scale} />;
}
