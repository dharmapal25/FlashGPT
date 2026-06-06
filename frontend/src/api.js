import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// if session inside available then hit into /chat/new else /login
// api.interceptors.response.use((response) => {
  
// })





export default api;
