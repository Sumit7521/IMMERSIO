// context/AvatarContext.js
import { createContext, useContext, useState, useEffect } from "react";
import { fetchAvatars } from "../api/avatar";

const AvatarContext = createContext();

export const AvatarProvider = ({ children }) => {
  const [avatarUrl, setAvatarUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const avatars = await fetchAvatars();
      if (avatars?.length) setAvatarUrl(avatars[0].url);
    })();
  }, []);

  return (
    <AvatarContext.Provider value={{ avatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
};

export const useAvatar = () => useContext(AvatarContext);
