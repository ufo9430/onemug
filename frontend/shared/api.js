// Shared code between client and server
// Useful to share types between client and server
// and/or small pure JS functions that can be used on both client and server

// Example response type for /api/demo
// Converted from TypeScript to JavaScript
// TypeScript interface removed
// Usage: { message: string }
// client/shared/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:8080",
  withCredentials: true,   
});

export default api;
