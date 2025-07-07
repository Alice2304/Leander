"use client"

import { useState, useRef } from "react"
import { X, Heart, Plus, Upload, Users, ImageIcon, Smile, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Anuncios() {
  const [ads, setAds] = useState([
    {
      id: "1",
      name: "Control de Estudio",
      description: "Solicitudes de constancias académicas solo los Lunes y Martes de 8:00 a 12:00 y 1:00 a 3:00",
      likes: "79",
      image: "https://noticias.cruzeirodosuleducacional.edu.br/wp-content/uploads/2019/06/950x351.jpg",
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_Unexca_Positivo.jpg",
    },
    {
      id: "2",
      name: "Nucleo Altagracia",
      description: "No habrá actividades académicas esta semana por fumigación",
      likes: "364.6k",
      image: "https://noticias.cruzeirodosuleducacional.edu.br/wp-content/uploads/2019/06/950x351.jpg",
      profileImage: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTzeAIjZShfj8Bafy06GFiBvRNF2lzH2m7GlA&s",
    },
    {
      id: "3",
      name: "Centro de estudiantes",
      description: "Pronto se abrirá convocatoria para el centro de estudiantes, estar atentos",
      likes: "75.4k",
      image: "https://noticias.cruzeirodosuleducacional.edu.br/wp-content/uploads/2019/06/950x351.jpg",
      profileImage:
        "https://img.favpng.com/4/25/8/letter-case-u-alphabet-word-png-favpng-ZBFmhuzyaii8D2kBxVHDvT0LV.jpg",
    },
    {
      id: "4",
      name: "Control de Estudio",
      description: "Se le recuerda a los estudiantes del 4-2 que tienen reunión el día Jueves a las 2:00 pm",
      likes: "96",
      image: "https://noticias.cruzeirodosuleducacional.edu.br/wp-content/uploads/2019/06/950x351.jpg",
      profileImage: "https://upload.wikimedia.org/wikipedia/commons/7/72/Logo_Unexca_Positivo.jpg",
    },
  ])

  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    expiresAt: "",
    image: "",
    profileImage: "",
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Referencias para los inputs de archivo
  const imageInputRef = useRef(null)
  const profileImageInputRef = useRef(null)

  const removeAd = (id) => {
    setAds(ads.filter((ad) => ad.id !== id))
  }

  // Función para manejar la carga de archivos
  const handleFileUpload = (file, type) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (type === "main") {
          setNewAd({ ...newAd, image: e.target.result })
        } else if (type === "profile") {
          setNewAd({ ...newAd, profileImage: e.target.result })
        }
      }
      reader.readAsDataURL(file)
    } else {
      alert("Por favor selecciona un archivo de imagen válido")
    }
  }

  // Función para abrir el selector de archivos
  const openFileSelector = (type) => {
    if (type === "main") {
      imageInputRef.current?.click()
    } else if (type === "profile") {
      profileImageInputRef.current?.click()
    }
  }

  const handleCreateAd = async () => {
    if (newAd.title && newAd.description) {
      try {
        const { createAnnouncement } = await import("../lib/fetch/announcements");
        await createAnnouncement({
          title: newAd.title,
          content: newAd.description,
          expiresAt: newAd.expiresAt || null,
        });
        setNewAd({
          title: "",
          description: "",
          expiresAt: "",
          image: "",
          profileImage: "",
        });
        setIsCreateDialogOpen(false);
        alert("¡Anuncio creado exitosamente!");
        // Opcional: recargar anuncios desde el backend aquí
      } catch (error) {
        alert("Error al crear el anuncio");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Anuncios</h1>
            <p className="text-gray-400">Gestiona y visualiza todos los anuncios institucionales</p>
          </div>

          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white flex-shrink-0"
          >
            <Plus className="w-4 h-4 mr-2" />
            Crear Anuncio
          </Button>
        </div>

        {/* Inputs de archivo ocultos */}
        <input
          type="file"
          ref={imageInputRef}
          onChange={(e) => handleFileUpload(e.target.files[0], "main")}
          accept="image/*"
          style={{ display: "none" }}
        />
        <input
          type="file"
          ref={profileImageInputRef}
          onChange={(e) => handleFileUpload(e.target.files[0], "profile")}
          accept="image/*"
          style={{ display: "none" }}
        />

        {/* Dialog separado */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
            <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <DialogTitle className="text-xl font-bold">Crear anuncio</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* User Profile Section */}
              <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
                <img
                  src={newAd.profileImage || "/placeholder.svg?height=40&width=40"}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-white font-semibold">Usuario</h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-400">
                    <Users className="w-3 h-3" />
                    <span>Público</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area */}

              <div className="space-y-4">
                {/* Título del anuncio */}
                <div>
                  <input
                    type="text"
                    value={newAd.title}
                    onChange={(e) => setNewAd({ ...newAd, title: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                    placeholder="Título del anuncio"
                  />
                </div>
                {/* Fecha de expiración */}
                <div>
                  <label className="block text-gray-300 text-sm mb-1" htmlFor="expiresAt">Fecha de expiración</label>
                  <input
                    id="expiresAt"
                    type="date"
                    value={newAd.expiresAt}
                    onChange={(e) => setNewAd({ ...newAd, expiresAt: e.target.value })}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                </div>
                {/* Descripción */}
                <div>
                  <Textarea
                    value={newAd.description}
                    onChange={(e) => setNewAd({ ...newAd, description: e.target.value })}
                    className="bg-transparent border-none text-white text-lg resize-none focus:ring-0 focus:outline-none p-0"
                    placeholder="¿Qué quieres anunciar?"
                    rows={3}
                  />
                </div>
                {/* Image Preview */}
                {newAd.image && (
                  <div className="relative">
                    <img
                      src={newAd.image || "/placeholder.svg"}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => setNewAd({ ...newAd, image: "" })}
                      className="absolute top-2 right-2 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                )}
                {/* Colorful icon like in the reference */}
                <div className="flex justify-start">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>

              {/* Add to Post Section */}
              <div className="border border-gray-600 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Añadir a tu anuncio</span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openFileSelector("main")}
                      className="p-3 hover:bg-gray-700 rounded-full transition-colors"
                      title="Subir imagen principal"
                    >
                      <Camera className="w-5 h-5 text-green-500" />
                    </button>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCreateAd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!newAd.title || !newAd.description}
              >
                Publicar
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Anuncios</p>
                  <p className="text-2xl font-bold text-white">{ads.length}</p>
                </div>
                <div className="bg-blue-600 p-2 rounded-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anuncios Activos</p>
                  <p className="text-2xl font-bold text-white">{ads.length}</p>
                </div>
                <div className="bg-green-600 p-2 rounded-lg">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Anuncios Hoy</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <div className="bg-purple-600 p-2 rounded-lg">
                  <Upload className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ads Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {ads.map((ad) => (
            <div key={ad.id} className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {/* Close button */}
              <button
                onClick={() => removeAd(ad.id)}
                className="absolute top-3 right-3 z-10 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>

              {/* Main image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={ad.image || "/placeholder.svg?height=200&width=300"}
                  alt={ad.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={ad.profileImage || "/placeholder.svg?height=40&width=40"}
                    alt={`${ad.name} profile`}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-white font-semibold text-lg">{ad.name}</h3>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{ad.description}</p>

                <div className="flex items-center justify-between">
                  <Button className="flex-1 bg-gray-700 hover:bg-gray-600 text-white border-0 mr-2">
                    <Heart className="w-4 h-4 mr-2" />
                    Me gusta
                  </Button>
                  <span className="text-gray-400 text-sm">{ad.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {ads.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-800 rounded-lg p-8 max-w-md mx-auto">
              <Upload className="w-16 h-16 text-gray-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay anuncios</h3>
              <p className="text-gray-400 mb-4">Crea tu primer anuncio para comenzar</p>
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Crear Anuncio
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
