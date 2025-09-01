import React, { useState } from "react";
import AvatarCreator from "../components/Avatar/AvatarCreator";
import axios from "axios";
import { useNavigate } from "react-router";

const Avatar = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAvatarExport = async (url) => {
    setAvatarUrl(url);
    console.log("🎉 Avatar URL:", url);

    setSaving(true);
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/api/avatar/save",
        { url }, // optionally add avatarData if needed
        { withCredentials: true } // important: send cookie
      );

      console.log("✅ Avatar saved:", res.data);

      // Optionally, navigate to next page after save
      // navigate('/next-step');

    } catch (err) {
      console.error(err.response?.data || err);
      setError(err.response?.data?.message || "Failed to save avatar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ height: "100vh", padding: "20px", textAlign: "center" }}>
      {!avatarUrl ? (
        <AvatarCreator onAvatarExport={handleAvatarExport} />
      ) : (
        <div>
          <h2>✅ Avatar Created Successfully!</h2>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <a href={avatarUrl} target="_blank" rel="noreferrer">
            View Avatar
          </a>
          <br /><br />
          {saving ? (
            <p>Saving avatar...</p>
          ) : (
            <button onClick={() => setAvatarUrl("")}>
              Create New Avatar
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Avatar;
