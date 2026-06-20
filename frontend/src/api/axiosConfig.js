import axios from 'axios';

// #Consumo de APIs con axios
// Centraliza la URL base del backend para todas las peticiones.
// Axios para consumir las APIs REST desarrolladas en Express y enviar el token JWT automáticamente mediante interceptors
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

// #JWT
// Agrega automáticamente el token al header Authorization.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;