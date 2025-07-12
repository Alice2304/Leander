"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import EditProfileModal from "@/components/edit-profile-modal"
import { getUserNick, getUserEmail} from "@/lib/global.js"

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(true)

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold text-white">Edita tu Perfil</h1>
        <p className="text-gray-600">Haz clic en el botón para abrir empezar a editar tu perfil</p>
        <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
          Abrir Editor de Perfil
        </Button>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={{
          username: getUserNick() || "Usuario",
          email: getUserEmail() || "Usuario@example.com",
          profileImage: "/profile-photo.png",
        }}
      />
    </div>
  )
}
