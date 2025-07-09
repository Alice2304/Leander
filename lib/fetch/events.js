// lib/fetch/events.js
import { API_BASE_URL, getAuthToken, getUser } from "../global";

// Crea un nuevo evento
async function createEvent({ title, description, date, location }) {
  const userObj = getUser();
  const body = {
    title,
    description,
    date,
    location,
    created_at: new Date(),
    user: userObj && userObj.id ? userObj.id : "" // Siempre 1 como solicitaste
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

// Función para marcar asistencia a un evento
async function attendEvent(eventId) {
  const userObj = getUser();
  if (!userObj || !userObj.id) {
    throw new Error("Usuario no autenticado");
  }
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/event/attend/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userObj.id }),
  });
  if (!response.ok) {
    throw new Error("Error al marcar asistencia al evento");
  }
  return response.json();
}

// Función para quitar la reservación de un evento
async function unattendEvent(eventId) {
  const userObj = getUser();
  if (!userObj || !userObj.id) {
    throw new Error("Usuario no autenticado");
  }
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/event/unattend/${eventId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userObj.id }),
  });
  if (!response.ok) {
    throw new Error("Error al quitar la reservación del evento");
  }
  return response.json();
}

export { attendEvent, unattendEvent };

// Función para eliminar un evento por ID
async function deleteEvent(eventId) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/event/${eventId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el evento");
  }
  return response.json();
}

export { deleteEvent };
