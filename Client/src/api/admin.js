import api from "../config/axios";

export const checkAdmin = async () => {
  try {
    const res = await api.get("/auth/admin")

    return res.data.isAdmin === true;
  } catch (err) {
    console.error("Error checking admin status:", err.response?.data || err);
    return false; // default to false if any error
  }
};
