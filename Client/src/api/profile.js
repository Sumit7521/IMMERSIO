import api from "../config/axios";

export const fetchProfile = async () => {
  try {
    const res = await api.get("/auth/profile")
    return res.data.user;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch profile";
  }
};
