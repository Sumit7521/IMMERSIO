import React from "react";
import { AvatarCreator as RPMAvatarCreator } from "@readyplayerme/react-avatar-creator";

// Config for direct customization (no popup)
const config = {
  clearCache: true,
  bodyType: "fullbody",  // "halfbody" | "fullbody"
  quickStart: true,      // direct to customization
  language: "en",
};

const style = { width: "100%", height: "100vh", border: "none" };

const AvatarCreator = ({ onAvatarExported }) => {
  const handleAvatarExported = (event) => {
    // Safely check event data
    if (event && event.data && event.data.url) {
      const url = event.data.url;
      console.log("🎉 Avatar exported URL:", url);
      if (onAvatarExported) onAvatarExported(url);
    } else {
      console.warn("⚠️ Unexpected AvatarExported event data:", event.data);
    }
  };

  return (
    <RPMAvatarCreator
      subdomain="sumit-sharma"
      config={config}
      style={style}
      onAvatarExported={handleAvatarExported}
    />
  );
};

export default AvatarCreator;
