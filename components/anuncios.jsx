"use client"

import { useState, useRef, useEffect } from "react"
import { X, Heart, Plus, Upload, Users, ImageIcon, Smile, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function Anuncios() {
  const [ads, setAds] = useState([])
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [adIdToDelete, setAdIdToDelete] = useState(null);

  useEffect(() => {
    const loadAnnouncements = async () => {
      try {
        const { fetchAnnouncements } = await import("../lib/fetch/announcements");
        const data = await fetchAnnouncements();
        // Si la respuesta es { announcements: [...] }
        setAds(data.announcements || data);
      } catch (error) {
        console.error("Error al cargar anuncios:", error);
      }
    };
    loadAnnouncements();
  }, []);

  const [newAd, setNewAd] = useState({
    title: "",
    description: "",
    expiresAt: "",
    image: "",
    profileImage: "",
  })

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false)
  const [adToUpdate, setAdToUpdate] = useState(null)

  // Referencias para los inputs de archivo
  const imageInputRef = useRef(null)
  const profileImageInputRef = useRef(null)

  // Elimina un anuncio llamando a la API y actualiza la lista
  const removeAd = async (id) => {
    if (!id) return;
    try {
      const { deleteAnnouncement, fetchAnnouncements } = await import("../lib/fetch/announcements");
      await deleteAnnouncement(id);
      // Recargar anuncios después de eliminar
      const data = await fetchAnnouncements();
      setAds(data.announcements || data);
      setIsConfirmDialogOpen(false);
      setAdIdToDelete(null);
      alert("¡Anuncio eliminado exitosamente!");
    } catch (error) {
      alert("Error al eliminar el anuncio");
    }
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
        const { createAnnouncement, fetchAnnouncements } = await import("../lib/fetch/announcements");
        await createAnnouncement({
          title: newAd.title,
          content: newAd.description,
          expiresAt: newAd.expiresAt || null,
        });
        // Recargar anuncios después de crear uno nuevo
        const data = await fetchAnnouncements();
        setAds(data.announcements || data);
        setNewAd({
          title: "",
          description: "",
          expiresAt: "",
          image: "",
          profileImage: "",
        });
        setIsCreateDialogOpen(false);
        alert("¡Anuncio creado exitosamente!");
      } catch (error) {
        alert("Error al crear el anuncio");
      }
    }
  }

  // Maneja la apertura del modal de actualización
  const openUpdateDialog = (ad) => {
    setAdToUpdate({
      ...ad,
      // Asegura que los campos estén definidos para el formulario
      title: ad.title || "",
      content: ad.content || "",
      expiresAt: ad.expiresAt ? ad.expiresAt.slice(0, 10) : "",
    });
    setIsUpdateDialogOpen(true);
  };

  // Maneja la actualización del anuncio
  const handleUpdateAd = async () => {
    if (adToUpdate && adToUpdate.title && adToUpdate.content) {
      try {
        const { updateAnnouncement, fetchAnnouncements } = await import("../lib/fetch/announcements");
        await updateAnnouncement({
          id: adToUpdate._id,
          title: adToUpdate.title,
          content: adToUpdate.content,
          expiresAt: adToUpdate.expiresAt || null,
        });
        // Recargar anuncios después de actualizar
        const data = await fetchAnnouncements();
        setAds(data.announcements || data);
        setIsUpdateDialogOpen(false);
        setAdToUpdate(null);
        alert("¡Anuncio actualizado exitosamente!");
      } catch (error) {
        alert("Error al actualizar el anuncio");
      }
    }
  };

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
            <div key={ad._id} className="relative bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
              {/* Close button */}
              <button
                onClick={() => {
                  setAdIdToDelete(ad._id);
                  setIsConfirmDialogOpen(true);
                }}
                className="absolute top-3 right-3 z-10 bg-black bg-opacity-50 rounded-full p-1 hover:bg-opacity-70 transition-all"
              >
                <X className="w-4 h-4 text-white" />
              </button>
      {/* Modal de confirmación para eliminar anuncio */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">¿Eliminar anuncio?</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p>¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer.</p>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              className="border-gray-500 text-gray-300 hover:bg-gray-700"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setAdIdToDelete(null);
              }}
            >
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => removeAd(adIdToDelete)}
            >
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

              {/* Update button */}
              <button
                onClick={() => openUpdateDialog(ad)}
                className="absolute top-3 left-3 z-10 bg-white hover:bg-gray-200 rounded-full p-1 transition-all"
                title="Actualizar anuncio"
                style={{ border: '1px solid #1e3a8a' }}
              >
                <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4 13.5V16h2.5l7.06-7.06-2.5-2.5L4 13.5z" stroke="#1e3a8a" strokeWidth="1.5" fill="none"/>
                  <path d="M14.85 6.15a1.5 1.5 0 0 0 0-2.12l-1.88-1.88a1.5 1.5 0 0 0-2.12 0l-1.06 1.06 4 4 1.06-1.06z" stroke="#1e3a8a" strokeWidth="1.5" fill="none"/>
                </svg>
              </button>

              {/* Main image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={"/aviso.jpg"}
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
                    <h3 className="text-white font-semibold text-lg">{ad.title}</h3>
                  </div>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{ad.content}</p>

              </div>
            </div>
          ))}
      {/* Modal para actualizar anuncio */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-lg">
          <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <DialogTitle className="text-xl font-bold">Actualizar anuncio</DialogTitle>
          </DialogHeader>
          {adToUpdate && (
            <div className="space-y-4">
              {/* Título del anuncio */}
              <div>
                <input
                  type="text"
                  value={adToUpdate.title}
                  onChange={e => setAdToUpdate({ ...adToUpdate, title: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                  placeholder="Título del anuncio"
                />
              </div>
              {/* Fecha de expiración */}
              <div>
                <label className="block text-gray-300 text-sm mb-1" htmlFor="updateExpiresAt">Fecha de expiración</label>
                <input
                  id="updateExpiresAt"
                  type="date"
                  value={adToUpdate.expiresAt}
                  onChange={e => setAdToUpdate({ ...adToUpdate, expiresAt: e.target.value })}
                  className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                />
              </div>
              {/* Descripción */}
              <div>
                <Textarea
                  value={adToUpdate.content}
                  onChange={e => setAdToUpdate({ ...adToUpdate, content: e.target.value })}
                  className="bg-transparent border-none text-white text-lg resize-none focus:ring-0 focus:outline-none p-0"
                  placeholder="¿Qué quieres anunciar?"
                  rows={3}
                />
              </div>
              <Button
                onClick={handleUpdateAd}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                disabled={!adToUpdate.title || !adToUpdate.content}
              >
                Actualizar
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
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
