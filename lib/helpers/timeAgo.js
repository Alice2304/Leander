  export function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diff = Math.floor((now - date) / 1000); // en segundos
  if (isNaN(diff)) return "";
  if (diff < 60) return `hace ${diff} segundos`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)} minutos`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)} horas`;
  if (diff < 2592000) return `hace ${Math.floor(diff / 86400)} días`;
  if (diff < 31536000) return `hace ${Math.floor(diff / 2592000)} meses`;
  return `hace ${Math.floor(diff / 31536000)} años`;
}