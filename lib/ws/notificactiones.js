

import { io } from "socket.io-client";
import { getAuthToken } from "../global";

// Conexión al servidor Socket.IO
const socket = io("http://localhost:3800", {
  autoConnect: false,
});

// Obtener el token dinámicamente y autenticar
function connectAndAuthenticate() {
  const token = getAuthToken();
  socket.connect();
  socket.emit("authenticate", token);
}

// Escuchar eventos de autenticación
socket.on("authenticated", (data) => {
  console.log("Autenticado:", data);
});

socket.on("auth_error", (err) => {
  console.error("Error de autenticación:", err);
});

// Exportar el socket y la función de conexión
export { socket, connectAndAuthenticate };
