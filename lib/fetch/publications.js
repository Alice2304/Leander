// lib/fetch/publications.js
import { API_BASE_URL, getAuthToken, getUser } from "../global";


// Crea una nueva publicación
async function createPublication({ title, text, file = null }) {
  const userObj = getUser();
  const formData = new FormData();
  formData.append("title", title);
  formData.append("text", text);
  formData.append("user", userObj && userObj.id ? userObj.id : "");
  formData.append("created_at", new Date().toISOString());
  if (file) {
    const filesArray = Array.isArray(file) ? file : [file];
    filesArray.forEach(f => {
      if (f) formData.append("files", f);
    });
  }

  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Error al crear la publicación");
  }

  return response.json();
}


// Obtiene todas las publicaciones
async function fetchPublications() {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publications`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al obtener publicaciones");
  }
  
  return response.json();
}


// Actualiza una publicación existente
async function updatePublication({ _id, title, text, file = null }) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ title, text }),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar la publicación");
  }
  return response.json();
}

// Elimina una publicación existente
async function deletePublication(_id) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/${_id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar la publicación");
  }
  return response.json();
}

// Agrega un comentario a una publicación
async function addCommentToPublication(publicationId, text) {
  const userObj = getUser();
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/comment/${publicationId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Error al agregar el comentario");
  }
  return response.json();
}

// Elimina un comentario de una publicación
async function deleteCommentFromPublication(publicationId, commentId) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/comment/${publicationId}/${commentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Error al eliminar el comentario");
  }
  return response.json();
}

// Edita un comentario de una publicación
async function updateCommentOnPublication(publicationId, commentId, text) {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/${publicationId}/comment/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) {
    throw new Error("Error al actualizar el comentario");
  }
  return response.json();
}

export { createPublication, fetchPublications, updatePublication, deletePublication, likePublication, unlikePublication, addCommentToPublication, deleteCommentFromPublication, updateCommentOnPublication };



// Dar like a una publicación (PUT)
async function likePublication(publicationId) {
  const userObj = getUser();
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/like/${publicationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userObj && userObj.id ? userObj.id : null }),
  });
  if (!response.ok) {
    throw new Error("Error al dar like a la publicación");
  }
  return response.json();
}

// Quitar like a una publicación (PUT)
async function unlikePublication(publicationId) {
  const userObj = getUser();
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}/publication/unlike/${publicationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ userId: userObj && userObj.id ? userObj.id : null }),
  });
  if (!response.ok) {
    throw new Error("Error al quitar like a la publicación");
  }
  return response.json();
}
