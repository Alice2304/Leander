"use client"

import { useState, useRef } from "react"
import { X, Camera, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function EditProfileModal({
  isOpen = true,
  onClose,
  initialData = {
    username: "usuario123",
    email: "usuario@ejemplo.com",
    profileImage: "/profile-photo.png",
  },
}) {
  const [formData, setFormData] = useState({
    username: initialData.username,
    email: initialData.email,
    password: "",
    confirmPassword: "",
  })

  const [profileImage, setProfileImage] = useState(initialData.profileImage)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const fileInputRef = useRef(null)

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Por favor selecciona un archivo de imagen válido" }))
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "La imagen debe ser menor a 5MB" }))
        return
      }

      // Crear URL temporal para previsualización
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)

      // Limpiar error de imagen si existía
      if (errors.image) {
        setErrors((prev) => ({ ...prev, image: "" }))
      }
    }
  }

  const handleCameraClick = () => {
    fileInputRef.current?.click()
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.username.trim()) {
      newErrors.username = "El nombre de usuario es requerido"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El correo electrónico es requerido"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Formato de correo inválido"
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      console.log("Guardando cambios:", { ...formData, profileImage })
      // Aquí iría la lógica para guardar los cambios
      if (onClose) onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Editar perfil</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Profile Photo Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-white">Foto del perfil</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCameraClick}
                className="text-blue-400 hover:text-blue-300 hover:bg-gray-800 p-0 h-auto"
              >
                Editar
              </Button>
            </div>
            <div className="relative w-20 h-20 mx-auto">
              <Avatar className="w-20 h-20">
                <AvatarImage src={profileImage || "/placeholder.svg"} alt="Profile" />
                <AvatarFallback className="bg-gray-700 text-white text-xl">
                  {formData.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button
                size="icon"
                onClick={handleCameraClick}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700"
              >
                <Camera className="h-4 w-4" />
              </Button>
              {/* Input file oculto */}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
            </div>
            {errors.image && <p className="text-sm text-red-400 text-center mt-2">{errors.image}</p>}
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-white">
                Nombre de usuario
              </Label>
              <Input
                id="username"
                type="text"
                value={formData.username}
                onChange={(e) => handleInputChange("username", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="Ingresa tu nombre de usuario"
              />
              {errors.username && <p className="text-sm text-red-400">{errors.username}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-white">
                Correo electrónico
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="Ingresa tu correo electrónico"
              />
              {errors.email && <p className="text-sm text-red-400">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-white">
                Nueva contraseña
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 pr-10"
                  placeholder="Ingresa nueva contraseña (opcional)"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && <p className="text-sm text-red-400">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-white">
                Confirmar contraseña
              </Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  className="bg-gray-800 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 pr-10"
                  placeholder="Confirma tu nueva contraseña"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-sm text-red-400">{errors.confirmPassword}</p>}
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSave} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium">
              Guardar cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
