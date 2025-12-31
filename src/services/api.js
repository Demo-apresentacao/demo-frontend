import axios from "axios";



const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 50000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, 
});
console.log("🌍 API BASE URL:", process.env.NEXT_PUBLIC_API_URL);

export default api;