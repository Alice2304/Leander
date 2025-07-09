// lib/fetch/announcements.js
import { API_BASE_URL, getAuthToken, getUser } from "../global";


// Crea un nuevo anuncio con los parámetros requeridos por el API
async function createAnnouncement({ title, content, expiresAt = null }) {
  const userObj = getUser();
  const body = {
    title,
    content,
    user: userObj && userObj.id ? userObj.id : "", // Siempre 1 como solicitaste
    expiresAt: expiresAt || null
  };

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/announcement`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear el anuncio");
  }

  return response.json();
}

// Obtiene todos los anuncios
async function fetchAnnouncements() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/announcements`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener anuncios");
  }
  return response.json();
}

export { createAnnouncement, fetchAnnouncements };

// Elimina un anuncio por ID
async function deleteAnnouncement(id) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/announcement/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el anuncio");
  }
  return response.json();
}

export { deleteAnnouncement };

// Actualiza un anuncio existente por ID
async function updateAnnouncement({ id, title, content, expiresAt = null }) {
  const userObj = getUser();
  const body = {
    title,
    content,
    user: userObj && userObj.id ? userObj.id : "",
    expiresAt: expiresAt || null
  };

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/announcement/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al actualizar el anuncio");
  }

  return response.json();
}

export { updateAnnouncement };
