import React, { useEffect, useState, useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useAnimations } from "@react-three/drei";
import { SkeletonUtils } from "three-stdlib";
import { fetchAvatars } from "../../api/avatar";
import * as THREE from 'three'

export default function Avatar({ currentAction = "idle", scale = 1 }) {
  const [avatarScene, setAvatarScene] = useState(null);
  const [animations, setAnimations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const avatarRef = useRef();

  useEffect(() => {
    let isMounted = true;

    const loadAvatar = async () => {
      try {
        setIsLoading(true);
        
        // Fetch avatar data
        const avatars = await fetchAvatars();
        if (!avatars.length || !isMounted) return;

        const loader = new GLTFLoader();
        
        // Load avatar model
        const gltf = await loader.loadAsync(avatars[0].url);
        if (!isMounted) return;
        
        const clonedScene = SkeletonUtils.clone(gltf.scene);
        
        // Load animations from public folder
        const animFiles = ["idle.glb", "walk.glb", "run.glb", "jump.glb"];
        const loadedAnimations = [];

        // Load all animation files
        for (const file of animFiles) {
          try {
            const animGltf = await loader.loadAsync(`/animations/${file}`);
            if (animGltf.animations && animGltf.animations.length > 0) {
              // Get the animation name from filename (remove .glb extension)
              const animName = file.replace('.glb', '');
              
              // Rename the animation to match our action names
              animGltf.animations.forEach(anim => {
                anim.name = animName;
                loadedAnimations.push(anim);
              });
              
              console.log(`Loaded animation: ${animName}`, animGltf.animations);
            }
          } catch (error) {
            console.warn(`Failed to load animation ${file}:`, error);
          }
        }

        if (!isMounted) return;

        console.log("All loaded animations:", loadedAnimations);
        setAvatarScene(clonedScene);
        setAnimations(loadedAnimations);
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading avatar:", error);
        setIsLoading(false);
      }
    };

    loadAvatar();

    return () => {
      isMounted = false;
    };
  }, []);

  const { actions, mixer } = useAnimations(animations, avatarScene);

  // Debug: Log available actions
  useEffect(() => {
    if (actions && Object.keys(actions).length > 0) {
      console.log("Available actions:", Object.keys(actions));
      console.log("Current action requested:", currentAction);
    }
  }, [actions, currentAction]);

  // Switch animations
  useEffect(() => {
    if (!actions || !mixer) return;

    // Stop all current actions
    Object.values(actions).forEach((action) => {
      if (action) {
        action.stop();
      }
    });

    // Play the requested action
    const actionToPlay = actions[currentAction];
    if (actionToPlay) {
      console.log(`Playing animation: ${currentAction}`);
      actionToPlay.reset().fadeIn(0.2).play();
      
      // Set loop mode
      actionToPlay.setLoop(THREE.LoopRepeat);
      actionToPlay.clampWhenFinished = false;
    } else {
      console.warn(`Animation "${currentAction}" not found. Available:`, Object.keys(actions));
      
      // Fallback to idle if available
      if (actions.idle && currentAction !== 'idle') {
        console.log("Falling back to idle animation");
        actions.idle.reset().fadeIn(0.2).play();
      }
    }

    return () => {
      // Cleanup function
      if (actionToPlay) {
        actionToPlay.fadeOut(0.2);
      }
    };
  }, [currentAction, actions, mixer]);

  if (isLoading) {
    return (
      <mesh>
        <boxGeometry args={[1, 2, 1]} />
        <meshStandardMaterial color="gray" wireframe />
      </mesh>
    );
  }

  if (!avatarScene) {
    console.warn("Avatar scene not loaded");
    return null;
  }

  return (
    <group>
      <primitive ref={avatarRef} object={avatarScene} scale={scale} />
    </group>
  );
}