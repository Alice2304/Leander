"use client"

import { useState } from "react"
import { registerUser } from "@/lib/fetch/user"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, User } from "lucide-react"
import Link from "next/link"

export default function Registro() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    surname: "",
    username: "",
    acceptTerms: false,
  })
  const [profileImage, setProfileImage] = useState(null)
  const [uploading, setUploading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setUploading(true)
      // Crear URL temporal para preview
      const imageUrl = URL.createObjectURL(file)
      setProfileImage(imageUrl)
    } catch (error) {
      console.error("Error uploading image:", error)
    } finally {
      setUploading(false)
    }
  }

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess(false)
    try {
      const params = {
        name: formData.fullName,
        surname: formData.surname,
        nick: formData.username,
        email: formData.email,
        password: formData.password,
        // image: null // Si quieres enviar la imagen, deberías manejar el upload real
      }
      await registerUser(params)
      setSuccess(true)
      // Mostrar alerta y redirigir
      alert("¡Registro exitoso! Serás redirigido al inicio de sesión.")
      window.location.href = "/"
    } catch (err) {
      setError(err?.message || "Error al registrar usuario")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold text-white">Crear cuenta</CardTitle>
          <CardDescription className="text-gray-400">Completa los datos para registrarte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Profile Image Upload */}
            <div className="flex flex-col items-center space-y-2">
              <div className="relative">
                <Avatar className="w-20 h-20">
                  <AvatarImage src={profileImage || undefined} />
                  <AvatarFallback className="bg-gray-700 text-gray-300">
                    <User className="w-8 h-8" />
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="profile-image"
                  className="absolute -bottom-1 -right-1 bg-blue-600 hover:bg-blue-700 rounded-full p-1.5 cursor-pointer transition-colors"
                >
                  <Upload className="w-3 h-3 text-white" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </div>
              <span className="text-xs text-gray-400">{uploading ? "Subiendo..." : "Foto de perfil"}</span>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">
                Correo electrónico
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="tu@ejemplo.com"
                required
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-300">
                Contraseña
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="••••••••"
                required
              />
            </div>

            {/* Full Name Field */}
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-gray-300">
                Nombre
              </Label>
              <Input
                id="fullName"
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="Juan"
                required
              />
            </div>
            {/* Surname Field */}
            <div className="space-y-2">
              <Label htmlFor="surname" className="text-gray-300">
                Apellido
              </Label>
              <Input
                id="surname"
                name="surname"
                type="text"
                value={formData.surname}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="Pérez"
                required
              />
            </div>

            {/* Username Field */}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-gray-300">
                Nombre de usuario
              </Label>
              <Input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleInputChange}
                className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
                placeholder="juanperez"
                required
              />
            </div>

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={formData.acceptTerms}
                onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, acceptTerms: checked }))}
                className="border-gray-600 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
              />
              <div className="text-sm text-gray-400 leading-relaxed">
                <Label htmlFor="terms" className="cursor-pointer">
                  Al registrarte, aceptas nuestras{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Condiciones
                  </a>{" "}
                  y la{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300 underline">
                    Política de privacidad
                  </a>
                  .
                </Label>
              </div>
            </div>

            {/* Submit Button */}
            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-500 text-sm text-center">¡Registro exitoso!</div>
            )}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              disabled={!formData.acceptTerms || loading}
            >
              {loading ? "Registrando..." : "Registrarse"}
            </Button>
          </form>

          {/* Login Link */}
          <div className="text-center text-sm text-gray-400 pt-4">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/" className="text-blue-400 hover:text-blue-300 underline">
              Inicia sesión
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
