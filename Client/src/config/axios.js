// api.js
import axios from "axios"

const api = axios.create({
  baseURL: "https://immersio-rwyc.onrender.com/api", // change to your backend URL
  withCredentials: true, // 👈 send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
})


export default api
