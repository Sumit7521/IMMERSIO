// api.js
import axios from "axios"

const api = axios.create({
  baseURL: "http://localhost:3000/api", // change to your backend URL
  withCredentials: true, // 👈 send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
})


export default api
