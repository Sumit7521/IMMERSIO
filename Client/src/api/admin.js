import axios from "axios";

/**
 * Checks if the current user is an admin.
 * @returns {Promise<boolean>} Returns true if admin, false otherwise.
 */
export const checkAdmin = async () => {
  try {
    const res = await axios.get("http://localhost:3000/api/auth/admin", {
      withCredentials: true, // send cookies if needed
    });
    
    // Assuming API returns { isAdmin: true } or { isAdmin: false }
    return res.data.isAdmin === true;
  } catch (err) {
    console.error("Error checking admin status:", err.response?.data || err);
    return false; // default to false if any error
  }
};
