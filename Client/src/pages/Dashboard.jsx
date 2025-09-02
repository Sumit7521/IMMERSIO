// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useControls } from "leva";
import AvatarLobbyAnimation from "../components/Avatar/AvatarLobbyAnimation";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [avatars, setAvatars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get("http://localhost:3000/api/auth/profile", {
          withCredentials: true,
        });
        setUser(profileRes.data.user);

        const avatarRes = await axios.get("http://localhost:3000/api/avatar/get-avatar", {
          withCredentials: true,
        });
        setAvatars(avatarRes.data.avatars || []);
      } catch (err) {
        console.error(err.response?.data || err);
        setError(err.response?.data?.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const latestAvatarUrl = avatars.length > 0 ? avatars[avatars.length - 1].url : null;

  // 👇 Leva controls
  const { posX, posY, posZ, rotX, rotY, rotZ, scale } = useControls("Avatar Controls", {
    posX: { value: 0, min: -5, max: 5, step: 0.1 },
    posY: { value: -2.1, min: -5, max: 5, step: 0.1 },
    posZ: { value: 0, min: -5, max: 5, step: 0.1 },
    rotX: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotY: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    rotZ: { value: 0, min: -Math.PI, max: Math.PI, step: 0.1 },
    scale: { value: 2.3, min: 0.1, max: 5, step: 0.1 },
  });

  return (
    <div className="w-full h-screen flex bg-gray-900 text-white">
      {/* Left panel */}
      <div className="w-1/3 p-8 border-r border-gray-700 overflow-y-auto">
        {loading ? (
          <p className="text-white">Loading...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">User Info</h2>
            <p className="mb-2">
              <strong>Name:</strong> {user.fullname.firstname} {user.fullname.lastname}
            </p>
            <p className="mb-2">
              <strong>Username:</strong> {user.username}
            </p>
            <p className="mb-4">
              <strong>Email:</strong> {user.email}
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-2">Your Avatars</h3>
            {avatars.length > 0 ? (
              <ul className="space-y-2">
                {avatars.map((a, idx) => (
                  <li key={idx} className="bg-gray-800 p-2 rounded">
                    <span className="truncate block">{a.url}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No avatars created yet.</p>
            )}
          </>
        )}
      </div>

      {/* Right panel */}
      <div className="w-2/3 flex items-center justify-center">
        <div className="w-full h-full bg-gray-800 rounded-lg">
          {!loading && !error && (
            <AvatarLobbyAnimation
              avatarUrl={latestAvatarUrl}
              posX={posX}
              posY={posY}
              posZ={posZ}
              rotX={rotX}
              rotY={rotY}
              rotZ={rotZ}
              scale={scale}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
