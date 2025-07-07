// lib/fetch/announcements.js
import { API_BASE_URL, getAuthToken } from "../global";


// Crea un nuevo anuncio con los parámetros requeridos por el API
async function createAnnouncement({ title, content, expiresAt = null }) {
  const body = {
    title,
    content,
    user: 1, // Siempre 1 como solicitaste
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

export { createAnnouncement };
