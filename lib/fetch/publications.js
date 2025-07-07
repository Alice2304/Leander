// lib/fetch/publications.js
import { API_BASE_URL, getAuthToken } from "../global";

// Crea una nueva publicación
async function createPublication({ text, file = null }) {
  const body = {
    text,
    file:null,
    user: 1, // Siempre 1 como solicitaste
    created_at: new Date(),
  };


  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear la publicación");
  }

  return response.json();
}

export { createPublication };
