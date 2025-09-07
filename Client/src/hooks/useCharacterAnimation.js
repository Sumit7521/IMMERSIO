import { useState } from "react";

export const useCharacterAnimation = () => {
  const [animation, setAnimation] = useState("idle");
  const [isJumping, setIsJumping] = useState(false);

  return { animation, setAnimation, isJumping, setIsJumping };
};
