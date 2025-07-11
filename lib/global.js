// lib/global.js
// Archivo para definir variables globales de la aplicación

// Ejemplo de variables globales
export const API_BASE_URL = "https://leander-api.onrender.com/api"; // Cambia esto a tu URL de API real
export const API_BASE_IMG = "https://leander-api.onrender.com"; // Cambia esto a tu URL de API real
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

// Funciones para obtener campos individuales del usuario desde localStorage
export function getUserId() {
  const user = getUser();
  return user ? user.id : null;
}

export function getUserName() {
  const user = getUser();
  return user ? user.name : null;
}

export function getUserSurname() {
  const user = getUser();
  return user ? user.surname : null;
}

export function getUserNick() {
  const user = getUser();
  return user ? user.nick : null;
}

export function getUserEmail() {
  const user = getUser();
  return user ? user.email : null;
}

export function getUserRole() {
  const user = getUser();
  return user ? user.role : null;
}

export function getUserImage() {
  const user = getUser();
  return user ? user.image : null;
}

// Devuelve true si el usuario es administrador (ROLE_ADMIN)
export function isAdmin() {
  return getUserRole() === "ROLE_ADMIN";
}
