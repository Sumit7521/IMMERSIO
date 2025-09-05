import React, { useEffect, useState } from "react";
import { useControls } from "leva";
import { useNavigate } from "react-router";
import AvatarLobbyAnimation from "../components/Avatar/AvatarLobbyAnimation";

import { fetchAvatars } from "../api/avatar";
import { fetchProfile } from "../api/profile";
import api from "../config/axios";
import { logout } from "../lib/slice/authSlice";
import { useDispatch } from "react-redux";

const Dashboard = () => {
  const navigate = useNavigate();

  const [avatars, setAvatars] = useState([]);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetchAvatars().then(setAvatars).catch(console.error);
    fetchProfile().then(setProfile).catch(console.error);
  }, []);

  const latestAvatarUrl =
    avatars.length > 0 ? avatars[avatars.length - 1].url : null;
const dispatch = useDispatch();
  const handleLogout = async () => {
  try {
    await api.get("/auth/logout");
    dispatch(logout()); // ✅ clear user state
    navigate("/");
  } catch (error) {
    if (error.response) {
      console.error("Server error:", error.response.data);
      alert(error.response.data.message || "Logout failed. Try again.");
    } else if (error.request) {
      console.error("Network error:", error.request);
      alert("Network error. Please check your connection.");
    } else {
      console.error("Error:", error.message);
      alert("Unexpected error during logout.");
    }
  }
};




  // Avatar / Camera / Light controls
  const avatarControls = useControls("Avatar Controls", {
    posX: { value: 0, min: -5, max: 5, step: 0.1 },
    posY: { value: -2.5, min: -5, max: 5, step: 0.1 },
    posZ: { value: 0, min: -5, max: 5, step: 0.1 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    scale: { value: 2.3, min: 0.1, max: 5, step: 0.1 },
  });

  const cameraControls = useControls("Camera Controls", {
    camX: { value: 0, min: -10, max: 10, step: 0.1 },
    camY: { value: 2, min: -10, max: 10, step: 0.1 },
    camZ: { value: 5, min: -20, max: 20, step: 0.1 },
    camRotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    camRotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    camRotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.01 },
    fov: { value: 50, min: 10, max: 120, step: 1 },
  });

  const lightControls = useControls("Lights", {
    light1X: { value: 3, min: -10, max: 10, step: 0.1 },
    light1Y: { value: -2.8, min: -10, max: 10, step: 0.1 },
    light1Z: { value: 5.9, min: -10, max: 10, step: 0.1 },
    light1Color: { value: "#87CEEB" },
    light1Intensity: { value: 100, min: 0, max: 100, step: 0.1 },
    light2X: { value: -3, min: -10, max: 10, step: 0.1 },
    light2Y: { value: 3, min: -10, max: 10, step: 0.1 },
    light2Z: { value: -3, min: -10, max: 10, step: 0.1 },
    light2Color: { value: "#FF69B4" },
    light2Intensity: { value: 80, min: 0, max: 100, step: 0.1 },
  });

  return (
    <div
      className="w-full h-screen flex items-center justify-center bg-cover bg-center relative"
      style={{ backgroundImage: "url('/images/Lobbyimage.png')" }}
    >
      {profile && (
        <div className="absolute top-5 left-5 p-6 rounded-xl shadow-lg backdrop-blur-lg bg-white/20 border border-white/30 text-white max-w-sm z-10 font-orbitron">
          <h2 className="text-xl font-bold mb-2">Player Profile</h2>
          <p className="font-medium">First Name: {profile.fullname.firstname}</p>
          <p className="font-medium">Last Name: {profile.fullname.lastname}</p>
          <p className="font-medium">Username: {profile.username}</p>
          <p className="font-medium">Email: {profile.email}</p>
          <p className="font-medium">Role: {profile.role}</p>
        </div>
      )}

      <button onClick={handleLogout} className="absolute bottom-5 left-5 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow-lg z-10 font-orbitron font-bold">
        Logout
      </button>

      <button
        onClick={() => navigate("/metaverse")} // ✅ navigate to Metaverse
        className="absolute bottom-5 right-5 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-lg z-10 font-orbitron font-bold"
      >
        Enter Metaverse
      </button>

      {latestAvatarUrl && (
        <AvatarLobbyAnimation
          avatarUrl={latestAvatarUrl}
          avatarControls={avatarControls}
          cameraControls={cameraControls}
          lightControls={lightControls}
        />
      )}
    </div>
  );
};

export default Dashboard;
