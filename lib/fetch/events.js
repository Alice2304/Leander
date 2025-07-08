// lib/fetch/events.js
import { API_BASE_URL, getAuthToken } from "../global";

// Crea un nuevo evento
async function createEvent({ title, description, date, location }) {
  const body = {
    title,
    description,
    date,
    location,
    created_at: new Date(),
    user: 1, // Siempre 1 como solicitaste
  };

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/event`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error("Error al crear el evento");
  }

  return response.json();
}

// Obtiene todos los eventos
async function fetchEvents() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/events`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener eventos");
  }
  return response.json();
}

export { createEvent, fetchEvents };
