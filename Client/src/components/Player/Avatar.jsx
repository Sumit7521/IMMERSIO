import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { fetchAvatars } from "../../api/avatar";

const ROOT_LIKELY = new Set([
  "Hips", "mixamorigHips", "Root", "Armature", "ArmatureRoot", "root", "hip", "hips"
]);

function stripRootMotion(clip, scene) {
  const names = new Set(ROOT_LIKELY);
  scene.traverse((o) => {
    if (!o.parent && o.type !== "Scene" && o.name) names.add(o.name);
    if (o.isBone && (!o.parent || !o.parent.isBone)) names.add(o.name);
  });

  const filteredTracks = clip.tracks.filter((track) => {
    const [nodePath, prop] = track.name.split(".");
    const nodeName = nodePath?.split("/").pop();
    if (prop === "position" && nodeName && names.has(nodeName)) return false;
    return true;
  });

  return new THREE.AnimationClip(
    clip.name,
    clip.duration || undefined,
    filteredTracks.length ? filteredTracks : clip.tracks
  );
}

export default function Avatar({ currentAction = "idle", scale = 1 }) {
  const [avatarScene, setAvatarScene] = useState(null);
  const [clips, setClips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const groupRef = useRef();
  const prevActionName = useRef(null);

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setIsLoading(true);
        const avatars = await fetchAvatars();
        if (!alive || !avatars?.length) return;

        const loader = new GLTFLoader();
        const base = await loader.loadAsync(avatars[0].url);
        if (!alive) return;
        const sceneClone = SkeletonUtils.clone(base.scene);

        const files = ["idle.glb", "walk.glb", "run.glb", "jump.glb"];
        const loadedClips = [];
        for (const file of files) {
          try {
            const anim = await loader.loadAsync(`/animations/${file}`);
            (anim.animations || []).forEach((c) => {
              const name = file.replace(".glb", "");
              const cloned = c.clone();
              cloned.name = name;
              loadedClips.push(cloned);
            });
          } catch (e) {
            console.warn(`Animation load failed: ${file}`, e);
          }
        }

        const sanitized = loadedClips.map((c) => stripRootMotion(c, sceneClone));
        if (!alive) return;
        setAvatarScene(sceneClone);
        setClips(sanitized);
      } catch (e) {
        console.error("Avatar load error:", e);
      } finally {
        if (alive) setIsLoading(false);
      }
    })();

    return () => { alive = false; };
  }, []);

  const { actions } = useAnimations(clips, avatarScene);

  useEffect(() => {
    if (!actions || !actions[currentAction]) return;

    const next = actions[currentAction];
    const prev = prevActionName.current ? actions[prevActionName.current] : null;

    next.reset().fadeIn(0.2).play();
    if (prev && prev !== next) prev.fadeOut(0.2);

    prevActionName.current = currentAction;

    if (currentAction === "jump") {
      next.clampWhenFinished = true;
      next.setLoop(THREE.LoopOnce);
    } else {
      next.setLoop(THREE.LoopRepeat, Infinity);
    }
  }, [actions, currentAction]);

  if (isLoading) return <mesh><boxGeometry args={[1, 2, 1]} /><meshStandardMaterial color="gray" wireframe /></mesh>;
  if (!avatarScene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={avatarScene} scale={scale} frustumCulled={false} />
    </group>
  );
}
