
import { API_BASE_URL, getAuthToken } from "@/lib/global";
const API_URL = API_BASE_URL;

// Enviar un mensaje
export async function sendMessage({ text, receiver }) {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/message`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token
    },
    body: JSON.stringify({ text, receiver })
  });
  return res.json();
}

// Obtener mensajes recibidos
export async function getReceivedMessages() {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/received-messages`, {
    headers: { 'Authorization': token }
  });
  return res.json();
}

// Obtener mensajes enviados
export async function getEmittedMessages() {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/emitted-messages`, {
    headers: { 'Authorization': token }
  });
  return res.json();
}

// Obtener cantidad de mensajes no vistos
export async function getUnviewedMessages() {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/unviewed-messages`, {
    headers: { 'Authorization': token }
  });
  return res.json();
}

// Marcar mensajes como vistos
export async function setViewedMessages() {
  const token = getAuthToken();
  const res = await fetch(`${API_URL}/viewed-messages`, {
    method: 'PUT',
    headers: { 'Authorization': token }
  });
  return res.json();
}
