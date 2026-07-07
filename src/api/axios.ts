import axios from "axios"

// Preconfigured Axios instance for the real Express backend.
// Point VITE_API_URL at the server and swap the mock `respond` calls in the
// feature API files for `api.get/post/...` calls.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api",
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("eventhub_token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export default api
