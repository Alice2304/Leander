"use client"

import { useState, useEffect } from "react"
import { fetchFollowing, fetchFollowers, unfollowUser } from "@/lib/fetch/user-follow"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export default function FollowersScreen() {
  const [activeTab, setActiveTab] = useState("followers")
  const [followingData, setFollowingData] = useState([])
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [errorFollowing, setErrorFollowing] = useState(null)
  const [followersData, setFollowersData] = useState([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [errorFollowers, setErrorFollowers] = useState(null)

  // Botón para dejar de seguir en seguidos
  const handleUnfollow = async (userId) => {
    if (!window.confirm("¿Seguro que quieres dejar de seguir a este usuario?")) return;
    try {
      await unfollowUser(userId);
      setFollowingData((prev) => prev.filter((u) => u.id !== userId));
    } catch (e) {
      alert("No se pudo dejar de seguir");
    }
  };

  const ContactItem = ({ contact, showUnfollow }) => (
    <div className="flex items-center justify-between p-3 hover:bg-gray-800/50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <Avatar className="h-12 w-12">
          <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
          <AvatarFallback className="bg-gray-600 text-white text-sm">{contact.initials}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">{contact.name}</h3>
          <p className="text-gray-400 text-xs truncate">{contact.subtitle}</p>
        </div>
      </div>
      {showUnfollow ? (
        <Button
          variant="outline"
          size="sm"
          className="text-red-400 border-red-400 hover:bg-red-900 hover:text-white"
          onClick={() => handleUnfollow(contact.id)}
        >
          Dejar de seguir
        </Button>
      ) : (
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-white hover:bg-gray-700">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      )}
    </div>
  )

  // Fetch following/followers data when tab changes
  useEffect(() => {
    if (activeTab === "following") {
      setLoadingFollowing(true)
      setErrorFollowing(null)
      fetchFollowing()
        .then((data) => {
          const mapped = Array.isArray(data.following)
            ? data.following.map((user) => ({
                id: user.id || user._id,
                name: user.name || user.username || "Usuario",
                subtitle: user.subtitle || "Seguido",
                avatar: user.avatar || "/placeholder.svg?height=40&width=40",
                initials:
                  user.initials ||
                  (user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"),
              }) )
            : [];
          setFollowingData(mapped)
        })
        .catch(() => {
          setErrorFollowing("Error al cargar seguidos")
        })
        .finally(() => setLoadingFollowing(false))
    } else if (activeTab === "followers") {
      setLoadingFollowers(true)
      setErrorFollowers(null)
      fetchFollowers()
        .then((data) => {
          const mapped = Array.isArray(data.followers)
            ? data.followers.map((user) => ({
                id: user.id || user._id,
                name: user.name || user.username || "Usuario",
                subtitle: user.subtitle || "Seguidor",
                avatar: user.avatar || "/placeholder.svg?height=40&width=40",
                initials:
                  user.initials ||
                  (user.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                    : "U"),
              }) )
            : [];
          setFollowersData(mapped)
        })
        .catch(() => {
          setErrorFollowers("Error al cargar seguidores")
        })
        .finally(() => setLoadingFollowers(false))
    }
  }, [activeTab])

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-md mx-auto bg-gray-900">
        {/* Custom Tabs Header */}
        <div className="flex border-b border-gray-700">
          <button
            onClick={() => setActiveTab("followers")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "followers"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Seguidores
          </button>
          <button
            onClick={() => setActiveTab("following")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "following"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Seguidos
          </button>
        </div>

        {/* Content */}
        <div className="divide-y divide-gray-800">
          {activeTab === "followers" && (
            loadingFollowers ? (
              <div className="p-4 text-gray-400">Cargando seguidores...</div>
            ) : errorFollowers ? (
              <div className="p-4 text-red-400">{errorFollowers}</div>
            ) : followersData.length === 0 ? (
              <div className="p-4 text-gray-400">No tienes seguidores.</div>
            ) : (
              followersData.map((contact) => <ContactItem key={contact.id} contact={contact} />)
            )
          )}
          {activeTab === "following" && (
            loadingFollowing ? (
              <div className="p-4 text-gray-400">Cargando seguidos...</div>
            ) : errorFollowing ? (
              <div className="p-4 text-red-400">{errorFollowing}</div>
            ) : followingData.length === 0 ? (
              <div className="p-4 text-gray-400">No sigues a nadie.</div>
            ) : (
              followingData.map((contact) => (
                <ContactItem key={contact.id} contact={contact} showUnfollow />
              ))
            )
          )}
        </div>
      </div>
    </div>
  )
}
