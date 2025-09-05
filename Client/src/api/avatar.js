import api from "../config/axios";

export const fetchAvatars = async () => {
  try {
    const res = await api.get("/avatar/get-avatar")
    return res.data.avatars || [];
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch avatars";
  }
};
