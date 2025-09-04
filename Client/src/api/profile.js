import axios from "axios";

export const fetchProfile = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/auth/profile", {
      withCredentials: true,
    });
    return res.data.user;
  } catch (err) {
    throw err.response?.data?.message || "Failed to fetch profile";
  }
};
