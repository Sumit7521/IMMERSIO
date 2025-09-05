// src/pages/Avatar.jsx
import React, { useState } from "react";
import AvatarCreator from "../components/Avatar/AvatarCreator";
import { useNavigate } from "react-router";
import api from "../config/axios";

const Avatar = () => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAvatarExported = async (url) => {
    setSaving(true);
    setError("");

    try {
      const res = await api.post("/avatar/save", { url });
      console.log("✅ Avatar saved:", res.data);

      // 👇 Navigate to dashboard after success
      navigate("/dashboard");
    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="w-full h-screen bg-gradient-to-b from-gray-900 to-gray-700 flex flex-col items-center justify-center p-4">
      <div className="w-full h-full">
        <AvatarCreator onAvatarExported={handleAvatarExported} />
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {saving && <p className="text-yellow-300 mt-2">Saving avatar...</p>}
    </div>
  );
};

export default Avatar;
