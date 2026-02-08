import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://temp-1-wexh.onrender.com/";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 20000 // Render cold start safe
});

export default api;
