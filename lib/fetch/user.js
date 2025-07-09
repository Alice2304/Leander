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
    const formData = new FormData();
    formData.append('name', params.name);
    formData.append('surname', params.surname);
    formData.append('nick', params.nick.toLowerCase());
    formData.append('email', params.email.toLowerCase());
    formData.append('password', params.password);
    if (params.image) {
      formData.append('image', params.image); // params.image debe ser un File o Blob
    }
    const response = await axios.post(`${API_BASE_URL}/register`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

/**
 * Obtiene la lista de usuarios llamando a la ruta /users del backend.
 * Requiere autenticación (token en el header Authorization).
 * @returns {Promise<Object>} - Respuesta del backend con la lista de usuarios
 */
export async function fetchUsers() {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/users`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
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
