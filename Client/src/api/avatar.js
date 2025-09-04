import axios from "axios";

export const fetchAvatars = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/avatar/get-avatar", {
      withCredentials: true,
    });
    return res.data.avatars || [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch avatars";
  }
};
