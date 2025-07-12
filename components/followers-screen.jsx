"use client"

import { useState, useEffect } from "react"
import { fetchFollowing, fetchFollowers, unfollowUser, followUser } from "@/lib/fetch/user-follow"
import { fetchUsers } from "@/lib/fetch/user"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal } from "lucide-react"

export default function FollowersScreen() {
  // Usuarios del sistema
  const [users, setUsers] = useState([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [usersError, setUsersError] = useState(null)
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  // Filtrado y paginación
  // Estado para seguimiento
  const [followingIds, setFollowingIds] = useState([])
  const [followLoading, setFollowLoading] = useState("") // id del usuario que se está siguiendo
  // Función para refrescar seguidos
  const refreshFollowing = () => {
    fetchFollowing()
      .then(data => {
        const arr = Array.isArray(data.following) ? data.following : []
        setFollowingIds(arr.map(u => u.id || u._id))
        setFollowingData(arr.map(user => ({
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
        })))
      })
      .catch(() => {
        setFollowingIds([])
        setFollowingData([])
      })
  }
  // Cargar seguidos al montar para saber a quién ya sigo
  useEffect(() => {
    refreshFollowing()
  }, [])
  const filteredUsers = users.filter(u => {
    const q = search.toLowerCase()
    return (
      u.name?.toLowerCase().includes(q) ||
      u.surname?.toLowerCase().includes(q) ||
      u.nick?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q)
    )
  })
  const totalPages = Math.ceil(filteredUsers.length / pageSize)
  const paginatedUsers = filteredUsers.slice((page-1)*pageSize, page*pageSize)
  const [activeTab, setActiveTab] = useState("followers")
  const [followingData, setFollowingData] = useState([])
  const [loadingFollowing, setLoadingFollowing] = useState(false)
  const [errorFollowing, setErrorFollowing] = useState(null)
  const [followersData, setFollowersData] = useState([])
  const [loadingFollowers, setLoadingFollowers] = useState(false)
  const [errorFollowers, setErrorFollowers] = useState(null)

  // Cargar todos los usuarios al montar
  useEffect(() => {
    setUsersLoading(true)
    setUsersError(null)
    fetchUsers()
      .then(data => {
        // data.users o data según backend
        setUsers(Array.isArray(data.users) ? data.users : data)
      })
      .catch(() => setUsersError("Error al cargar usuarios"))
      .finally(() => setUsersLoading(false))
  }, [])

  // Botón para seguir usuario
  const handleFollow = async (userId) => {
    setFollowLoading(userId)
    try {
      await followUser(userId)
      refreshFollowing()
      // Si estás en la pestaña de seguidores, refresca también
      if (activeTab === "followers") {
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
      }
    } catch {
      alert("No se pudo seguir al usuario")
    } finally {
      setFollowLoading("")
    }
  }
  // Botón para dejar de seguir en seguidos
  const handleUnfollow = async (userId) => {
    if (!window.confirm("¿Seguro que quieres dejar de seguir a este usuario?")) return;
    setFollowLoading(userId)
    try {
      await unfollowUser(userId);
      refreshFollowing()
      // Si estás en la pestaña de seguidores, refresca también
      if (activeTab === "followers") {
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
      }
    } catch (e) {
      alert("No se pudo dejar de seguir");
    } finally {
      setFollowLoading("")
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
        {/* Usuarios del sistema con buscador y paginador */}
        <div className="p-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white mb-2">Usuarios</h2>
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full mb-2 px-3 py-2 rounded bg-gray-800 text-white placeholder-gray-400 border border-gray-700 focus:outline-none"
          />
          {usersLoading ? (
            <div className="text-gray-400">Cargando usuarios...</div>
          ) : usersError ? (
            <div className="text-red-400">{usersError}</div>
          ) : paginatedUsers.length === 0 ? (
            <div className="text-gray-400">No hay usuarios.</div>
          ) : (
            <ul className="divide-y divide-gray-800 mb-2">
          {paginatedUsers.map(user => {
            const id = user.id || user._id
            const isFollowing = followingIds.includes(id)
            return (
              <li key={id} className="flex items-center gap-3 py-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || "/placeholder.svg?height=32&width=32"} alt={user.name} />
                  <AvatarFallback className="bg-gray-600 text-white text-xs">
                    {user.name ? user.name[0] : "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="text-white text-sm font-medium truncate">{user.name} {user.surname}</span>
                  <span className="block text-xs text-gray-400 truncate">{user.nick} &bull; {user.email}</span>
                </div>
                {isFollowing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-red-400 border-red-400 hover:bg-red-900 hover:text-white"
                    disabled={followLoading === id}
                    onClick={() => handleUnfollow(id)}
                  >
                    {followLoading === id ? 'Dejando...' : 'Dejar de seguir'}
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2 text-blue-400 border-blue-400 hover:bg-blue-900 hover:text-white"
                    disabled={followLoading === id}
                    onClick={() => handleFollow(id)}
                  >
                    {followLoading === id ? 'Siguiendo...' : 'Seguir'}
                  </Button>
                )}
              </li>
            )
          })}
            </ul>
          )}
          {/* Paginador */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-2">
              <button
                className="px-2 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
                onClick={() => setPage(p => Math.max(1, p-1))}
                disabled={page === 1}
              >Anterior</button>
              <span className="text-gray-300 px-2">Página {page} de {totalPages}</span>
              <button
                className="px-2 py-1 rounded bg-gray-800 text-white disabled:opacity-50"
                onClick={() => setPage(p => Math.min(totalPages, p+1))}
                disabled={page === totalPages}
              >Siguiente</button>
            </div>
          )}
        </div>

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
