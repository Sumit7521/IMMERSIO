import React from "react";
import { Avatar } from "@readyplayerme/visage";

const AvatarViewer = ({ avatarUrl, width = 300, height = 300 }) => {
  if (!avatarUrl) return null;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-800 rounded-xl p-4">
      <h4 className="text-white mb-2">Preview:</h4>
      <Avatar modelSrc={avatarUrl} style={{ width, height }} />
    </div>
  );
};

export default AvatarViewer;
