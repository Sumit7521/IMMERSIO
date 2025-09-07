import React, { useEffect, useRef, useState } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import * as THREE from "three";
import { useAvatar } from "../../contexts/AvatarContext";

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

export default function Avatar({ avatarUrl: propUrl, currentAction = "idle", scale = 1 }) {
  const context = useAvatar();
  const avatarUrl = propUrl || context.avatarUrl; // Remote prop overrides context

  const [avatarScene, setAvatarScene] = useState(null);
  const [clips, setClips] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const groupRef = useRef();
  const prevActionName = useRef(null);

  useEffect(() => {
    if (!avatarUrl) return;

    let alive = true;

    (async () => {
      try {
        setIsLoading(true);

        const loader = new GLTFLoader();
        const base = await loader.loadAsync(avatarUrl);
        if (!alive) return;
        const sceneClone = SkeletonUtils.clone(base.scene);

        const animFiles = ["idle.glb", "walk.glb", "run.glb", "jump.glb"];
        const loadedClips = [];

        for (const file of animFiles) {
          try {
            const anim = await loader.loadAsync(`/animations/${file}`);
            (anim.animations || []).forEach((clip) => {
              const cloned = clip.clone();
              cloned.name = file.replace(".glb", "");
              loadedClips.push(cloned);
            });
          } catch (e) {
            console.warn(`Animation load failed: ${file}`, e);
          }
        }

        const sanitized = loadedClips.map((clip) => stripRootMotion(clip, sceneClone));
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
  }, [avatarUrl]);

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

  if (isLoading) return (
    <mesh>
      <boxGeometry args={[1, 2, 1]} />
      <meshStandardMaterial color="gray" wireframe />
    </mesh>
  );

  if (!avatarScene) return null;

  return (
    <group ref={groupRef}>
      <primitive object={avatarScene} scale={scale} frustumCulled={false} />
    </group>
  );
}
