/**
 * Realiza una petición de registro al backend usando los datos del usuario.
 * @param {Object} params - Datos del usuario
 * @param {string} params.name - Nombre
 * @param {string} params.surname - Apellido
 * @param {string} params.nick - Nombre de usuario
 * @param {string} params.email - Correo electrónico
 * @param {string} params.password - Contraseña
 * @returns {Promise<Object>} - Respuesta del backend
 */
export async function registerUser(params) {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, {
      name: params.name,
      surname: params.surname,
      nick: params.nick.toLowerCase(),
      email: params.email.toLowerCase(),
      password: params.password,
      image: null,
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

import axios from "axios";
import { API_BASE_URL } from "../global";

/**
 * Realiza una petición de login al backend usando correo y contraseña.
 * @param {string} email - Correo del usuario
 * @param {string} password - Contraseña del usuario
 * @returns {Promise<Object>} - Respuesta del backend
 */
export async function loginUser(email, password) {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    // Puedes personalizar el manejo de errores según tu backend
    throw error.response ? error.response.data : error;
  }
}
