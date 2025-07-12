"use client"

// --- SocialFeed.jsx ---
// Componente principal de feed social para crear, editar, eliminar publicaciones y gestionar comentarios.
// Incluye integración con backend, manejo de imágenes, likes y experiencia visual optimizada.
//
// Autor: [Tu Nombre]
// Última actualización: 2025-07-09
//
// --- Importaciones principales ---

// React & hooks
import { useState, useRef, useEffect } from "react"
// API & helpers
import { createPublication, fetchPublications, likePublication, unlikePublication, updatePublication, deletePublication, addCommentToPublication, updateCommentOnPublication, deleteCommentFromPublication } from "../lib/fetch/publications"
import { getUser, getUserId, API_BASE_IMG, getUserName, getUserNick, getUserImage } from "../lib/global"
import { followUser, unfollowUser } from "../lib/fetch/user-follow"
import { fetchFollowing } from "../lib/fetch/user-follow"
import { timeAgo } from "../lib/helpers/timeAgo"
// UI Components
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Camera, X, ImageIcon, Settings, Edit3, MoreHorizontal, Heart, MessageCircle, Share } from "lucide-react"

// --- Estado inicial para nueva publicación ---
const initialNewPost = {
  title: "",
  description: "",
  image: "",
  user: {
    name: getUserName() || "Usuario",
    avatar: API_BASE_IMG+getUserImage() || "",
    username: getUserNick() || "@usuario"
  },
  likes: 0,
  comments: 0,
  shares: 0,
  timestamp: "ahora"
};

/**
 * Componente que representa un solo comentario en la lista de comentarios.
 * Permite editar y eliminar si el comentario es del usuario actual.
 *
 * Props:
 * - c: Objeto comentario (incluye user, text, _id)
 * - commentPost: Publicación a la que pertenece el comentario
 * - fetchPublications: Función para recargar publicaciones
 * - setPostComments: Setter para actualizar comentarios en el modal
 * - updateCommentOnPublication: Función para editar comentario (API)
 * - deleteCommentFromPublication: Función para eliminar comentario (API)
 * - getUserId: Función para obtener el id del usuario actual
 */
function CommentItem({ c, commentPost, fetchPublications, setPostComments, updateCommentOnPublication, deleteCommentFromPublication, getUserId }) {
  return (
    <div className="flex items-start gap-3 relative bg-slate-700/60 rounded-xl p-3 mb-3">
      {/* Avatar del usuario del comentario */}
      <img src={c.user?.avatar || "/placeholder.svg"} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
      <div className="flex-1">
        {/* Nombre del usuario */}
        <span className="font-semibold text-slate-200">{c.user?.name || "Usuario"}</span>
        {/* Texto del comentario */}
        <p className="text-slate-300 text-sm">{c.text}</p>
      </div>
      {/* Acciones solo para el dueño del comentario */}
      {c.user === getUserId() && (
        <div className="absolute top-2 right-2 flex items-center gap-1">
          {/* Botón editar comentario */}
          <button
            className="p-1 hover:bg-slate-600 rounded-full"
            title="Editar comentario"
            onClick={async () => {
              const nuevoTexto = prompt('Editar comentario:', c.text);
              if (nuevoTexto && nuevoTexto.trim() && nuevoTexto !== c.text) {
                try {
                  await updateCommentOnPublication(commentPost._id, c._id, nuevoTexto.trim());
                  const updatedPosts = await fetchPublications();
                  const updatedPost = (updatedPosts.publications || updatedPosts).find(p => p._id === commentPost._id);
                  setPostComments(Array.isArray(updatedPost?.comments) ? updatedPost.comments : []);
                  alert('¡Comentario editado exitosamente!');
                } catch (error) {
                  alert('Error al editar el comentario');
                }
              }
            }}
          >
            <Edit3 className="w-4 h-4 text-blue-400" />
          </button>
          {/* Botón eliminar comentario */}
          <button
            className="p-1 hover:bg-slate-600 rounded-full"
            title="Eliminar comentario"
            onClick={async () => {
              if (window.confirm('¿Seguro que quieres eliminar este comentario?')) {
                try {
                  await deleteCommentFromPublication(commentPost._id, c._id);
                  const updatedPosts = await fetchPublications();
                  const updatedPost = (updatedPosts.publications || updatedPosts).find(p => p._id === commentPost._id);
                  setPostComments(Array.isArray(updatedPost?.comments) ? updatedPost.comments : []);
                  alert('¡Comentario eliminado exitosamente!');
                } catch (error) {
                  alert('Error al eliminar el comentario');
                }
              }
            }}
          >
            <X className="w-4 h-4 text-red-400" />
          </button>
        </div>
      )}
    </div>
  );
}

/**
 * Componente principal del feed social.
 * Permite crear, editar, eliminar publicaciones y gestionar comentarios.
 *
 * Funcionalidades:
 * - Listar publicaciones con likes, comentarios, imagen y usuario.
 * - Crear nueva publicación (con imagen opcional).
 * - Editar/eliminar publicaciones propias.
 * - Agregar, editar y eliminar comentarios en publicaciones.
 * - Modal para comentarios con barra de entrada y lista visual mejorada.
 * - Feedback visual y validaciones de usuario.
 *
 * Estado principal:
 * - posts: Lista de publicaciones
 * - isCreateDialogOpen: Modal crear publicación
 * - isEditDialogOpen: Modal editar publicación
 * - isDeleteDialogOpen: Modal eliminar publicación
 * - newPost: Estado del nuevo post
 * - editPost: Post a editar
 * - postIdToDelete: ID de post a eliminar
 * - isCommentsDialogOpen: Modal comentarios
 * - postComments: Lista de comentarios del post
 * - commentPost: Post seleccionado para comentarios
 * - newComment: Texto del nuevo comentario
 * - imageInputRef: Ref para input de imagen
 */
export default function SocialFeed() {
  // --- Estados globales ---
  const [posts, setPosts] = useState([]); // Lista de publicaciones
  const [following, setFollowing] = useState([]); // Lista de usuarios que sigo
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false); // Modal crear publicación
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // Modal editar publicación
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false); // Modal eliminar publicación
  const [newPost, setNewPost] = useState(initialNewPost); // Estado del nuevo post
  const [editPost, setEditPost] = useState(null); // Post a editar
  const [postIdToDelete, setPostIdToDelete] = useState(null); // ID de post a eliminar
  const [isCommentsDialogOpen, setIsCommentsDialogOpen] = useState(false); // Modal comentarios
  const [postComments, setPostComments] = useState([]); // Lista de comentarios del post
  const [commentPost, setCommentPost] = useState(null); // Post seleccionado para comentarios
  const [newComment, setNewComment] = useState(""); // Texto del nuevo comentario
  const imageInputRef = useRef(null); // Ref para input de imagen

  // --- Efectos ---
  // Carga inicial de publicaciones al montar el componente
  useEffect(() => {
    loadPosts();
    fetchFollowingUsers();
  }, []);

  // Cargar la lista de usuarios que sigo
  async function fetchFollowingUsers() {
    try {
      const data = await fetchFollowing();
      // data puede ser { following: [...] } o directamente un array
      setFollowing(data.following || data);
    } catch (error) {
      setFollowing([]);
    }
  }

  // --- Funciones de negocio ---
  /**
   * Carga todas las publicaciones del backend y actualiza el estado global.
   * Utiliza fetchPublications() para obtener los datos.
   */
  async function loadPosts() {
    try {
      const publications = await fetchPublications();
      setPosts(publications.publications || publications);
    } catch (error) {
      console.error("Error al cargar publicaciones:", error);
    }
  }

  /**
   * Crea una nueva publicación usando createPublication().
   * Valida que haya título y descripción. Permite imagen opcional.
   * Al crear, cierra el modal, limpia el estado y recarga publicaciones.
   */
  async function handleCreatePost() {
    if (newPost.title && newPost.description) {
      try {
        await createPublication({
          title: newPost.title,
          text: newPost.description,
          file: newPost.image instanceof File ? newPost.image : null,
        });
        setIsCreateDialogOpen(false);
        setNewPost(initialNewPost);
        await loadPosts();
        alert("¡Publicación creada exitosamente!");
      } catch (error) {
        alert("Error al crear la publicación");
      }
    }
  }

  /**
   * Guarda los cambios al editar una publicación existente.
   * Llama a updatePublication() y recarga publicaciones.
   */
  async function handleEditPostSave() {
    try {
      await updatePublication({
        _id: editPost._id,
        title: editPost.title,
        text: editPost.text,
      });
      setIsEditDialogOpen(false);
      setEditPost(null);
      await loadPosts();
      alert("¡Publicación actualizada exitosamente!");
    } catch (error) {
      alert("Error al actualizar la publicación");
    }
  }

  // --- Handlers de UI ---
  /**
   * Maneja la subida de archivos de imagen para nueva publicación.
   * Solo acepta archivos de tipo imagen.
   */
  function handleFileUpload(file) {
    if (file && file.type.startsWith("image/")) {
      setNewPost({ ...newPost, image: file });
    } else {
      alert("Por favor selecciona un archivo de imagen válido");
    }
  }

  /**
   * Abre el selector de archivos de imagen (input hidden).
   */
  function openFileSelector() {
    imageInputRef.current?.click();
  }

  /**
   * Abre el modal de edición para el post seleccionado.
   * Solo permite editar si el usuario es dueño del post.
   */
  function handleEditClick(post) {
    const user = getUser();
    if (!user || user.id !== post.user._id) {
      alert("Solo puedes editar tus propias publicaciones.");
      return;
    }
    setEditPost({ ...post });
    setIsEditDialogOpen(true);
  }

  // --- Renderizado principal ---
  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header superior con botón para crear publicación */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Social Feed</h1>
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear publicación
        </Button>
      </div>

      {/* Modal: Crear publicación */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-bold">Crear publicación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Perfil usuario (avatar y nombre) */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-700">
              <img
                src={newPost.user.avatar || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{newPost.user.username}</h3>
                <div className="flex items-center space-x-1 text-sm text-slate-400">
                  <span>Público</span>
                </div>
              </div>
            </div>
            {/* Formulario de título y descripción */}
            <div className="space-y-4">
              <input
                type="text"
                value={newPost.title}
                onChange={e => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full bg-transparent border-b border-slate-600 text-white text-lg focus:outline-none mb-2 p-1"
                placeholder="Título de la publicación"
              />
              <Textarea
                value={newPost.description}
                onChange={e => setNewPost({ ...newPost, description: e.target.value })}
                className="bg-transparent border-none text-white text-lg resize-none focus:ring-0 focus:outline-none p-0"
                placeholder="¿Qué quieres compartir?"
                rows={3}
              />
            </div>
            {/* Imagen preview si se seleccionó */}
            {newPost.image && (
              <div className="relative">
                <img
                  src={newPost.image instanceof File ? URL.createObjectURL(newPost.image) : newPost.image || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  onClick={() => setNewPost({ ...newPost, image: "" })}
                  className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            {/* Icono decorativo de imagen */}
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            {/* Adjuntar imagen (input hidden + botón) */}
            <div className="border border-slate-600 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">Añadir a tu publicación</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openFileSelector}
                    className="p-3 hover:bg-slate-700 rounded-full transition-colors"
                    title="Subir imagen principal"
                  >
                    <Camera className="w-5 h-5 text-green-500" />
                  </button>
                </div>
              </div>
            </div>
            <input
              type="file"
              ref={imageInputRef}
              onChange={e => handleFileUpload(e.target.files[0])}
              accept="image/*"
              style={{ display: "none" }}
            />
            <Button
              onClick={handleCreatePost}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!newPost.title || !newPost.description}
            >
              Publicar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal: Editar publicación */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-bold">Editar publicación</DialogTitle>
          </DialogHeader>
          {editPost && (
            <div className="space-y-4">
              <input
                type="text"
                value={editPost.title}
                onChange={e => setEditPost({ ...editPost, title: e.target.value })}
                className="w-full bg-transparent border-b border-slate-600 text-white text-lg focus:outline-none mb-2 p-1"
                placeholder="Título de la publicación"
              />
              <Textarea
                value={editPost.text}
                onChange={e => setEditPost({ ...editPost, text: e.target.value })}
                className="bg-transparent border-none text-white text-lg resize-none focus:ring-0 focus:outline-none p-0"
                placeholder="¿Qué quieres compartir?"
                rows={3}
              />
              <Button
                onClick={handleEditPostSave}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!editPost.title || !editPost.text}
              >
                Guardar cambios
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal de confirmación para eliminar publicación */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">¿Eliminar publicación?</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p>¿Estás seguro de que deseas eliminar esta publicación? Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setPostIdToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={async () => {
                if (!postIdToDelete) return;
                try {
                  await deletePublication(postIdToDelete);
                  await loadPosts();
                  setIsDeleteDialogOpen(false);
                  setPostIdToDelete(null);
                  alert("¡Publicación eliminada exitosamente!");
                } catch (error) {
                  alert("Error al eliminar la publicación");
                }
              }}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de comentarios para una publicación */}
      <Dialog open={isCommentsDialogOpen} onOpenChange={setIsCommentsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Comentarios</DialogTitle>
          </DialogHeader>
          {commentPost && (
            <>
              <div className="mb-4">
                <h2 className="font-semibold text-lg text-slate-100">{commentPost.title}</h2>
                <p className="text-slate-400 text-sm">{commentPost.text}</p>
              </div>
              {/* Barra para escribir comentario */}
              <div className="flex gap-2 items-center mb-4">
                <Textarea
                  value={newComment}
                  onChange={e => setNewComment(e.target.value)}
                  className="flex-1 bg-slate-700 border-none text-white resize-none"
                  placeholder="Escribe un comentario..."
                  rows={2}
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={!newComment.trim()}
                  onClick={async () => {
                    if (!newComment.trim()) return;
                    try {
                      await addCommentToPublication(commentPost._id, newComment.trim());
                      const updatedPosts = await fetchPublications();
                      const updatedPost = (updatedPosts.publications || updatedPosts).find(p => p._id === commentPost._id);
                      setPostComments(Array.isArray(updatedPost?.comments) ? updatedPost.comments : []);
                      setNewComment("");
                    } catch (error) {
                      alert("Error al agregar el comentario");
                    }
                  }}
                >
                  Comentar
                </Button>
              </div>
              {/* Lista de comentarios debajo de la barra */}
              <div className="max-h-60 overflow-y-auto space-y-3 mt-6">
                {postComments.length === 0 && <p className="text-slate-400 text-center">No hay comentarios aún.</p>}
                {postComments.map((c, idx) => (
                  <CommentItem
                    key={idx}
                    c={c}
                    commentPost={commentPost}
                    fetchPublications={fetchPublications}
                    setPostComments={setPostComments}
                    updateCommentOnPublication={updateCommentOnPublication}
                    deleteCommentFromPublication={deleteCommentFromPublication}
                    getUserId={getUserId}
                  />
                ))}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Feed de publicaciones principal */}
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden bg-slate-800 border-slate-700 shadow-xl relative">
          {/* Botón eliminar publicación (arriba derecha) solo para el dueño */}
          {getUserId() && getUserId() === post.user._id && (
            <button
              onClick={() => {
                setPostIdToDelete(post._id);
                setIsDeleteDialogOpen(true);
              }}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
              title="Eliminar publicación"
            >
              <X className="w-4 h-4 text-white" />
            </button>
          )}
          {/* Imagen principal de la publicación */}
          <div className="relative">
            <img src={post.files.length > 0 ? API_BASE_IMG + '/' + post.files[0].path : null} alt={post.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          </div>
          <CardContent className="p-5">
            {/* Info usuario (avatar, nombre, username, fecha) */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.user.image ? API_BASE_IMG + post.user.image : "/placeholder.png"}
                alt={post.user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-slate-600"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-100">{post.user.name}</h3>
                  {getUserId() && getUserId() !== post.user._id && (
                    following.some(u => u._id === post.user._id) ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-400 border-red-400 hover:bg-red-900 hover:text-white"
                        onClick={async () => {
                          if (!window.confirm("¿Seguro que quieres dejar de seguir a este usuario?")) return;
                          try {
                            await unfollowUser(post.user._id);
                            await loadPosts();
                            await fetchFollowingUsers();
                          } catch (e) {
                            alert("No se pudo dejar de seguir");
                          }
                        }}
                      >
                        Dejar de seguir
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-green-400 border-green-400 hover:bg-green-900 hover:text-white"
                        onClick={async () => {
                          try {
                            await followUser(post.user._id);
                            await loadPosts();
                            await fetchFollowingUsers();
                          } catch (e) {
                            alert("No se pudo seguir al usuario");
                          }
                        }}
                      >
                        Seguir
                      </Button>
                    )
                  )}
                </div>
                <p className="text-sm text-slate-400">
                  {post.user.username} • {timeAgo(post.created_at)}
                </p>
              </div>
            </div>
            {/* Contenido de la publicación */}
            <div className="mb-5">
              <h2 className="font-bold text-xl mb-3 text-slate-100">{post.title}</h2>
              <p className="text-slate-300 leading-relaxed">{post.text}</p>
            </div>
            {/* Acciones: like, comentarios, editar (si es dueño) */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center gap-6">
                {/* Botón de like (cambia color si el usuario ya dio like) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 transition-colors ${Array.isArray(post.likes) && getUser() && post.likes.includes(getUser().id) ? 'text-red-400 bg-slate-700/50' : 'text-slate-400 hover:text-red-400 hover:bg-slate-700/50'}`}
                  onClick={async () => {
                    try {
                      const user = getUser();
                      if (Array.isArray(post.likes) && user && post.likes.includes(user.id)) {
                        await unlikePublication(post._id);
                      } else {
                        await likePublication(post._id);
                      }
                      await loadPosts();
                    } catch (error) {
                      alert("Error al actualizar el like de la publicación");
                    }
                  }}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{Array.isArray(post.likes) ? post.likes.length : post.likes || 0}</span>
                </Button>
                {/* Botón de comentarios (abre modal) */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 transition-colors"
                  onClick={() => {
                    setCommentPost(post);
                    setPostComments(Array.isArray(post.comments) ? post.comments : []);
                    setIsCommentsDialogOpen(true);
                  }}
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{Array.isArray(post.comments) ? post.comments.length : post.comments || 0}</span>
                </Button>
                {/* Botón de compartir (oculto, para futuro) */}
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </Button> */}
              </div>
              <div className="flex items-center gap-1">
                {/* Botón de configuración (oculto, para futuro) */}
                {/* <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button> */}
                {/* Botón de editar publicación (solo dueño) */}
                {getUserId() && getUserId() === post.user._id && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors p-2"
                    onClick={() => handleEditClick(post)}
                  >
                    <Edit3 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
