"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import EditProfileModal from "@/components/edit-profile-modal"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-gray-900">Edita tu Perfil</h1>
        <p className="text-gray-600">Haz clic en el botón para abrir empezar a editar tu perfil</p>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          Abrir Editor de Perfil
        </Button>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          username: "usuario123",
          email: "usuario@ejemplo.com",
          profileImage: "/profile-photo.png",
        }}
      />
    </div>
  )
}
