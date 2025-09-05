// src/components/player/Avatar.jsx
import React, { useEffect, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { fetchAvatars } from "../../api/avatar";

export default function Avatar({ position = [0, 1, 0], scale = 1 }) {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    // Fetch avatars from backend
    fetchAvatars()
      .then((avatars) => {
        if (avatars.length > 0) {
          setAvatarUrl(avatars[0].url); // Take the first avatar
        }
      })
      .catch((err) => {
        console.error("Error fetching avatar:", err);
      });
  }, []);

  // Wait until URL is fetched
  if (!avatarUrl) return null;

  const { scene } = useGLTF(avatarUrl);

  return <primitive object={scene} position={position} scale={scale} />;
}
