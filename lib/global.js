// lib/global.js
// Archivo para definir variables globales de la aplicación

// Ejemplo de variables globales
export const API_BASE_URL = "http://localhost:3800/api"; // Cambia esto a tu URL de API real
export const API_BASE_IMG = "http://localhost:3800/"; // Cambia esto a tu URL de API real
export const APP_NAME = "Leander";
export const DEFAULT_LANGUAGE = "es";


// Función para obtener el token de autorización desde localStorage
export function getAuthToken() {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
}

// Función para obtener el usuario desde localStorage
export function getUser() {
  if (typeof window !== "undefined") {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        return JSON.parse(user);
      } catch (e) {
        return null;
      }
    }
  }
  return null;
}
