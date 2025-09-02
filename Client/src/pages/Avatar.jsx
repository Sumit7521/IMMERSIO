// src/pages/Avatar.jsx
import React, { useState } from "react";
import AvatarCreator from "../components/Avatar/AvatarCreator";
import AvatarViewer from "../components/Avatar/AvatarViewer";
import axios from "axios";

const Avatar = () => {
  const [avatarUrl, setAvatarUrl] = useState("");  
  const [showCreator, setShowCreator] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleAvatarExported = async (url) => {
    setAvatarUrl(url);
    setShowCreator(false);
    setSaving(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/avatar/save",
        { url },
        { withCredentials: true }
      );
      console.log("✅ Avatar saved:", res.data);
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col items-center justify-center p-4">
      
      {showCreator && (
        <div className="w-full h-full">
          <AvatarCreator onAvatarExported={handleAvatarExported} />
        </div>
      )}

      {!showCreator && avatarUrl && (
        <div className="flex flex-col items-center text-white">
          <h2 className="text-2xl font-semibold mb-4">✅ Avatar Created Successfully!</h2>
          {error && <p className="text-red-500 mb-2">{error}</p>}
          {saving && <p className="text-yellow-300 mb-2">Saving avatar...</p>}

          <div className="w-96 h-96 bg-gray-800 rounded-xl flex items-center justify-center mt-4">
            <AvatarViewer avatarUrl={avatarUrl} width={300} height={300} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar;
