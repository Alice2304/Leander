"use client"

import { useState, useEffect } from "react"
import {
  getReceivedMessages,
  sendMessage
} from "@/lib/fetch/message"
import { fetchUsers } from "@/lib/fetch/user"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Edit, Phone, Video, Info, Send } from "lucide-react"
import { socket, connectAndAuthenticate } from "@/lib/ws/notificactiones"

// Puedes obtener el token del usuario autenticado desde tu sistema de auth
const getToken = () => {
  if (typeof window !== 'undefined') {
	return localStorage.getItem('token') || ''
  }
  return ''
}



export default function ChatApp() {
  const [contacts, setContacts] = useState([])
  const [selectedContact, setSelectedContact] = useState(null)
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [userList, setUserList] = useState([])
  const [loadingUsers, setLoadingUsers] = useState(false)

  // Cargar mensajes recibidos y construir lista de contactos
  useEffect(() => {
	const fetchMessages = async () => {
	  setLoading(true)
	  try {
		const token = getToken()
		const res = await getReceivedMessages(token)
		if (res && res.messages) {
		  // Agrupar mensajes por emisor para crear contactos
		  const grouped = {}
		  res.messages.forEach(msg => {
			const emitter = msg.emitter
			if (!grouped[emitter._id]) {
			  grouped[emitter._id] = {
				id: emitter._id,
				name: `${emitter.name} ${emitter.surname}`,
				avatar: (emitter.name[0] + (emitter.surname ? emitter.surname[0] : '')).toUpperCase(),
				color: "bg-orange-500", // Puedes personalizar esto
				active: false,
				lastSeen: '',
				status: '',
				messages: []
			  }
			}
			grouped[emitter._id].messages.push({
			  id: msg._id,
			  sender: grouped[emitter._id].name,
			  content: msg.text,
			  time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			  isOwn: false
			})
		  })
		  const contactsArr = Object.values(grouped)
		  setContacts(contactsArr)
		  setSelectedContact(contactsArr[0] || null)
		}
	  } catch (e) {
		// Manejo de error
	  }
	  setLoading(false)
	}
	fetchMessages()
  }, [])

  // Cargar mensajes del contacto seleccionado
  useEffect(() => {
	if (!selectedContact) return
	setMessages(selectedContact.messages || [])
  }, [selectedContact])

  // Enviar mensaje
  const handleSend = async () => {
	if (!messageInput.trim() || !selectedContact) return
	try {
	  const res = await sendMessage({
		text: messageInput,
		receiver: selectedContact.id
	  })
	  if (res && res.message) {
		setMessages(prev => [
		  ...prev,
		  {
			id: res.message._id,
			sender: 'Tú',
			content: res.message.text,
			time: new Date(res.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
			isOwn: true
		  }
		])
		setMessageInput("")
	  }
	} catch (e) {
	  // Manejo de error
	}
  }

  // Conectar y escuchar mensajes nuevos por websocket
  useEffect(() => {
    connectAndAuthenticate();
    const handleNewMessage = (msg) => {
      setContacts(prevContacts => {
        // Buscar si el contacto ya existe
        let found = false;
        const updatedContacts = prevContacts.map(contact => {
          if (contact.id === msg.emitter) {
            found = true;
            return {
              ...contact,
              messages: [
                ...contact.messages,
                {
                  id: msg._id,
                  sender: contact.name,
                  content: msg.text,
                  time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                  isOwn: false
                }
              ]
            };
          }
          return contact;
        });
        // Si no existe, crear nuevo contacto
        if (!found) {
          updatedContacts.unshift({
            id: msg.emitter,
            name: "Nuevo contacto", // Puedes mejorar esto si tienes info del usuario
            avatar: "?",
            color: "bg-orange-500",
            active: false,
            lastSeen: '',
            status: '',
            messages: [{
              id: msg._id,
              sender: "Nuevo contacto",
              content: msg.text,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: false
            }]
          });
        }
        return [...updatedContacts];
      });
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  return (
	<>
	  <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
		<DialogContent className="max-w-md">
		  <DialogHeader>
			<DialogTitle>Selecciona un usuario para nuevo mensaje</DialogTitle>
		  </DialogHeader>
		  {loadingUsers ? (
			<div className="text-center py-4">Cargando usuarios...</div>
		  ) : (
			<div className="max-h-80 overflow-y-auto">
			  {userList.length === 0 ? (
				<div className="text-gray-400 text-center">No hay usuarios disponibles</div>
			  ) : (
				userList.map(user => (
				  <div
					key={user._id}
					className="flex items-center gap-3 p-2 hover:bg-gray-100/10 rounded-lg cursor-pointer"
					onClick={() => {
					  setShowUserModal(false)
					  setSelectedContact({
						id: user._id,
						name: `${user.name} ${user.surname}`,
						avatar: (user.name[0] + (user.surname ? user.surname[0] : '')).toUpperCase(),
						color: "bg-orange-500",
						active: false,
						lastSeen: '',
						status: '',
						messages: []
					  })
					}}
				  >
					<Avatar className="h-8 w-8">
					  <AvatarFallback className="bg-orange-500 text-white text-xs">
						{(user.name[0] + (user.surname ? user.surname[0] : '')).toUpperCase()}
					  </AvatarFallback>
					</Avatar>
					<span className="font-medium text-white">{user.name} {user.surname}</span>
				  </div>
				))
			  )}
			</div>
		  )}
		</DialogContent>
	  </Dialog>
	  <div className="flex h-screen w-full bg-gray-900 text-white rounded-lg overflow-hidden">
		{/* Sidebar */}
		<div className="w-80 bg-gray-800 border-r border-gray-700">
		  {/* Header */}
		  <div className="flex items-center justify-between p-4 border-b border-gray-700">
			<h2 className="text-lg font-semibold">Chats ({contacts.length})</h2>
			<div className="flex items-center gap-2">
			  <Button
				variant="ghost"
				size="icon"
				className="text-gray-400 hover:text-white"
				onClick={async () => {
				  setShowUserModal(true)
				  setLoadingUsers(true)
				  try {
					const res = await fetchUsers()
					setUserList(res.users || [])
				  } catch {
					setUserList([])
				  }
				  setLoadingUsers(false)
				}}
			  >
				<Edit className="h-4 w-4" />
			  </Button>
			  <Button
				variant="ghost"
				size="icon"
				className="text-gray-400 hover:text-white"
			  >
				<MoreHorizontal className="h-4 w-4" />
			  </Button>
			</div>
		  </div>

		{/* Contacts List */}
		<ScrollArea className="flex-1">
		  <div className="p-2">
			{contacts.map((contact) => (
			  <div
				key={contact.id}
				className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
				  selectedContact && selectedContact.id === contact.id
					? "bg-gray-700"
					: "hover:bg-gray-700/50"
				}`}
				onClick={() => setSelectedContact(contact)}
			  >
				<div className="relative">
				  <Avatar className="h-10 w-10">
					<AvatarFallback
					  className={`${contact.color} text-white text-sm font-medium`}
					>
					  {contact.avatar}
					</AvatarFallback>
				  </Avatar>
				  {contact.active && (
					<div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
				  )}
				</div>
				<div className="flex-1 min-w-0">
				  <p className="font-medium text-white truncate">
					{contact.name}
				  </p>
				  {contact.status && (
					<p className="text-sm text-gray-400 truncate">
					  {contact.status}
					</p>
				  )}
				</div>
			  </div>
			))}
		  </div>
		</ScrollArea>
	  </div>

	  {/* Main Chat Area */}
	  <div className="flex-1 flex flex-col">
		{/* Chat Header */}
		{selectedContact && (
		  <div className="flex items-center justify-between p-4 border-b border-gray-700">
			<div className="flex items-center gap-3">
			  <Avatar className="h-10 w-10">
				<AvatarFallback
				  className={`${selectedContact.color} text-white text-sm font-medium`}
				>
				  {selectedContact.avatar}
				</AvatarFallback>
			  </Avatar>
			  <div>
				<h3 className="font-medium text-white">
				  {selectedContact.name}
				</h3>
				{selectedContact.lastSeen && (
				  <p className="text-sm text-gray-400">
					{selectedContact.lastSeen}
				  </p>
				)}
			  </div>
			</div>
			<div className="flex items-center gap-2">
			  <Button
				variant="ghost"
				size="icon"
				className="text-gray-400 hover:text-white"
			  >
				<Phone className="h-4 w-4" />
			  </Button>
			  <Button
				variant="ghost"
				size="icon"
				className="text-gray-400 hover:text-white"
			  >
				<Video className="h-4 w-4" />
			  </Button>
			  <Button
				variant="ghost"
				size="icon"
				className="text-gray-400 hover:text-white"
			  >
				<Info className="h-4 w-4" />
			  </Button>
			</div>
		  </div>
		)}

		{/* Messages Area */}
		<ScrollArea className="flex-1 p-4">
		  <div className="space-y-4">
			{messages.map((message) => (
			  <div
				key={message.id}
				className={`flex ${
				  message.isOwn ? "justify-end" : "justify-start"
				}`}
			  >
				<div className="flex items-end gap-2 max-w-xs lg:max-w-md">
				  {!message.isOwn && (
					<Avatar className="h-8 w-8">
					  <AvatarFallback
						className={`${selectedContact ? selectedContact.color : ''} text-white text-xs`}
					  >
						{selectedContact ? selectedContact.avatar : ''}
					  </AvatarFallback>
					</Avatar>
				  )}
				  <div
					className={`px-4 py-2 rounded-2xl ${
					  message.isOwn
						? "bg-white text-gray-900 rounded-br-md"
						: "bg-gray-700 text-white rounded-bl-md"
					}`}
				  >
					<p className="text-sm">{message.content}</p>
				  </div>
				  {message.isOwn && (
					<Avatar className="h-8 w-8">
					  <AvatarFallback className="bg-gray-600 text-white text-xs">
						Tú
					  </AvatarFallback>
					</Avatar>
				  )}
				</div>
				<div className="text-xs text-gray-400 ml-2 self-end">
				  {message.time}
				</div>
			  </div>
			))}
		  </div>
		</ScrollArea>

		{/* Message Input */}
		<div className="p-4 border-t border-gray-700">
		  <div className="flex items-center gap-2">
			<div className="flex-1 relative">
			  <Input
				placeholder="Escribe un mensaje..."
				value={messageInput}
				onChange={(e) => setMessageInput(e.target.value)}
				className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
				onKeyDown={e => {
				  if (e.key === 'Enter') handleSend()
				}}
			  />
			</div>

			<Button
			  variant="ghost"
			  size="icon"
			  className="text-gray-400 hover:text-white"
			  onClick={handleSend}
			  disabled={loading || !messageInput.trim()}
			>
			  <Send className="h-4 w-4" />
			</Button>
		  </div>
		</div>
	  </div>
	</div>
	</>
  )
}
