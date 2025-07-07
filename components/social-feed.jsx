"use client"

import { useState, useRef, useEffect } from "react"
import { createPublication, fetchPublications, likePublication, unlikePublication } from "../lib/fetch/publications"
import { getUser, API_BASE_IMG } from "../lib/global"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { timeAgo } from "../lib/helpers/timeAgo"
import { Plus, Camera, X, ImageIcon, Settings, Edit3, MoreHorizontal, Heart, MessageCircle, Share } from "lucide-react"
export default function SocialFeed() {
  const [posts, setPosts] = useState([])

  // Cargar publicaciones al montar el componente
  useEffect(() => {
    const loadPosts = async () => {
      try {
        const publications = await fetchPublications();
        setPosts(publications.publications);
      } catch (error) {
        console.error("Error al cargar publicaciones:", error);
      }
    };
    loadPosts();
  }, []);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newPost, setNewPost] = useState({
    title: "",
    description: "",
    image: "",
    user: {
      name: "Usuario",
      avatar: "",
      username: "@usuario"
    },
    likes: 0,
    comments: 0,
    shares: 0,
    timestamp: "ahora"
  })
  const imageInputRef = useRef(null)

  // Guardar el archivo File directamente en newPost.image
  const handleFileUpload = (file) => {
    if (file && file.type.startsWith("image/")) {
      setNewPost({ ...newPost, image: file });
    } else {
      alert("Por favor selecciona un archivo de imagen válido");
    }
  }

  const openFileSelector = () => {
    imageInputRef.current?.click()
  }



  const handleCreatePost = async () => {
    if (newPost.title && newPost.description) {
      try {
        await createPublication({
          title: newPost.title,
          text: newPost.description,
          file: newPost.image instanceof File ? newPost.image : null,
        });
        setIsCreateDialogOpen(false);
        setNewPost({
          title: "",
          description: "",
          image: "",
          user: {
            name: "Usuario",
            avatar: "",
            username: "@usuario"
          },
          likes: 0,
          comments: 0,
          shares: 0,
          timestamp: "ahora"
        });
        // Recargar publicaciones desde el backend después de crear
        try {
          const publications = await fetchPublications();
          setPosts(publications.publications || publications);
        } catch (error) {
          console.error("Error al recargar publicaciones:", error);
        }
        alert("¡Publicación creada exitosamente!");
      } catch (error) {
        alert("Error al crear la publicación");
      }
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
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

      {/* Dialog para crear publicación */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-bold">Crear publicación</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* User Profile Section */}
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-700">
              <img
                src={newPost.user.avatar || "/placeholder.svg?height=40&width=40"}
                alt="Profile"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="text-white font-semibold">{newPost.user.name}</h3>
                <div className="flex items-center space-x-1 text-sm text-slate-400">
                  <span>Público</span>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
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

            {/* Image Preview */}
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

            {/* Icono colorido */}
            <div className="flex justify-start">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-white" />
              </div>
            </div>

            {/* Add to Post Section */}
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

      {/* Feed de publicaciones */}
      {posts.map((post) => (
        <Card key={post._id} className="overflow-hidden bg-slate-800 border-slate-700 shadow-xl">
          {/* Post Image */}
          <div className="relative">
            <img src={post.files.length>0?API_BASE_IMG+post.files[0].path:null} alt={post.title} className="w-full h-64 object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent"></div>
          </div>

          <CardContent className="p-5">
            {/* User Info */}
            <div className="flex items-center gap-3 mb-4">
              <img
                src={post.user.avatar || "/placeholder.svg"}
                alt={post.user.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-slate-600"
              />
              <div className="flex-1">
                <h3 className="font-semibold text-slate-100">{post.user.name}</h3>
                <p className="text-sm text-slate-400">
                  {post.user.username} • {timeAgo(post.created_at)}
                </p>
              </div>
            </div>

            {/* Post Content */}
            <div className="mb-5">
              <h2 className="font-bold text-xl mb-3 text-slate-100">{post.title}</h2>
              <p className="text-slate-300 leading-relaxed">{post.text}</p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <div className="flex items-center gap-6">
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
                      // Recargar publicaciones después de dar/quitar like
                      const publications = await fetchPublications();
                      setPosts(publications.publications || publications);
                    } catch (error) {
                      alert("Error al actualizar el like de la publicación");
                    }
                  }}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">{Array.isArray(post.likes) ? post.likes.length : post.likes || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700/50 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">{Array.isArray(post.comments) ? post.comments.length : post.comments || 0}</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 text-slate-400 hover:text-green-400 hover:bg-slate-700/50 transition-colors"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm font-medium">{post.shares}</span>
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors p-2"
                >
                  <Settings className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors p-2"
                >
                  <Edit3 className="w-4 h-4" />
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="text-slate-500 hover:text-slate-300 hover:bg-slate-700/50 transition-colors p-2"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
