"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  getReceivedMessages,
  getEmittedMessages,
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
import {API_BASE_IMG, getUserId} from "@/lib/global"

// Puedes obtener el token del usuario autenticado desde tu sistema de auth
const getToken = () => {
  if (typeof window !== 'undefined') {
  return localStorage.getItem('token') || ''
  }
  return ''
}

// Utilidad para agrupar mensajes por usuario
function groupMessages(received, emitted) {
  const grouped = {};
  const myId = getUserId && getUserId(); // Obtener el ID del usuario autenticado
  if (received) {
    received.forEach(msg => {
      const emitter = msg.emitter;
      if (emitter._id === myId) return; // Excluir mi propio usuario
      if (!grouped[emitter._id]) {
        grouped[emitter._id] = {
          id: emitter._id,
          name: `${emitter.name} ${emitter.surname}`,
          avatar: (emitter.name[0] + (emitter.surname ? emitter.surname[0] : '')).toUpperCase(),
          color: "bg-orange-500",
          active: false,
          lastSeen: '',
          status: '',
          messages: [],
          hasNewMessage: false
        }
      }
      grouped[emitter._id].messages.push({
        id: msg._id,
        sender: grouped[emitter._id].name,
        content: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        created_at: msg.created_at
      })
    })
  }
  if (emitted) {
    emitted.forEach(msg => {
      const receiver = msg.receiver;
      if (receiver._id === myId) return; // Excluir mi propio usuario
      if (!grouped[receiver._id]) {
        grouped[receiver._id] = {
          id: receiver._id,
          name: `${receiver.name} ${receiver.surname}`,
          avatar: (receiver.name[0] + (receiver.surname ? receiver.surname[0] : '')).toUpperCase(),
          color: "bg-orange-500",
          active: false,
          lastSeen: '',
          status: '',
          messages: [],
          hasNewMessage: false
        }
      }
      grouped[receiver._id].messages.push({
        id: msg._id,
        sender: 'Tú',
        content: msg.text,
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: true,
        created_at: msg.created_at
      })
    })
  }
  Object.values(grouped).forEach(contact => {
    contact.messages.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  })
  // Ordenar contactos por la fecha del mensaje más reciente (descendente)
  return Object.values(grouped).sort((a, b) => {
    const lastA = a.messages.length ? new Date(a.messages[a.messages.length - 1].created_at) : 0;
    const lastB = b.messages.length ? new Date(b.messages[b.messages.length - 1].created_at) : 0;
    return lastB - lastA;
  });
}

// Componente: Lista de contactos
function ContactList({ contacts, selectedContact, onSelect }) {
  // Utilidad para truncar nombres largos
  const truncateName = (name, maxLength = 18) => {
    if (name.length > maxLength) {
      return name.slice(0, maxLength - 3) + '...';
    }
    return name;
  };
  // Utilidad para truncar preview del mensaje
  const truncateMsg = (msg, maxLength = 32) => {
    if (!msg) return '';
    return msg.length > maxLength ? msg.slice(0, maxLength - 3) + '...' : msg;
  };
  return (
    <ScrollArea className="flex-1">
      <div className="p-2">
        {contacts.map((contact) => {
          const lastMsg = contact.messages.length ? contact.messages[contact.messages.length - 1] : null;
          // Si existe contact.image, usar la imagen, si no, fallback
          const avatarImg = contact.image ? `${API_BASE_IMG}${contact.image}` : null;
          return (
            <div
              key={contact.id}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                selectedContact && selectedContact.id === contact.id
                  ? "bg-gray-700"
                  : "hover:bg-gray-700/50"
              }`}
              onClick={() => onSelect(contact)}
            >
              <div className="relative">
                <Avatar className="h-10 w-10">
                  {avatarImg ? (
                    <img src={avatarImg} alt={contact.name} className="h-10 w-10 rounded-full object-cover" />
                  ) : (
                    <AvatarFallback className={`${contact.color} text-white text-sm font-medium`}>
                      {contact.avatar}
                    </AvatarFallback>
                  )}
                </Avatar>
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-center relative">
                <div className="flex items-center justify-between w-full">
                  <div className="relative w-full flex items-center">
                    <p
                      className="font-medium text-white truncate"
                      title={contact.name}
                    >
                      {truncateName(contact.name)}
                    </p>
                    {contact.hasNewMessage && (
                      <span className="ml-2 absolute -top-2 left-full bg-green-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[24px] text-center z-10 shadow-lg">
                        Nuevo
                      </span>
                    )}
                  </div>
                  {lastMsg && (
                    <span className="text-xs text-gray-400 ml-2 whitespace-nowrap">
                      {lastMsg.time}
                    </span>
                  )}
                </div>
                {lastMsg && (
                  <span className="text-xs text-gray-400 truncate" title={lastMsg.content}>
                    {truncateMsg(lastMsg.content)}
                  </span>
                )}
              </div>
              {contact.active && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  )
}

// Componente: Header del chat
function ChatHeader({ contact }) {
  if (!contact) return null;
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className={`${contact.color} text-white text-sm font-medium`}>
            {contact.avatar}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-white">{contact.name}</h3>
          {contact.lastSeen && <p className="text-sm text-gray-400">{contact.lastSeen}</p>}
        </div>
      </div>
    </div>
  )
}

// Componente: Lista de mensajes
function MessageList({ messages, selectedContact }) {
  const endRef = useRef(null);
  useEffect(() => {
    if (endRef.current) {
      endRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  if (!selectedContact) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400 text-lg">
        Seleccione un contacto para ver los mensajes
      </div>
    )
  }
  return (
    <div className="flex-1 flex flex-col min-h-0">
      <ScrollArea className="flex-1 min-h-0 max-h-full">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-xs lg:max-w-md">
                {!message.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className={`${selectedContact ? selectedContact.color : ''} text-white text-xs`}>
                      {selectedContact ? selectedContact.avatar : ''}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className={`px-4 py-2 rounded-2xl ${message.isOwn ? "bg-white text-gray-900 rounded-br-md" : "bg-gray-700 text-white rounded-bl-md"}`}>
                  <p className="text-sm">{message.content}</p>
                </div>
                {message.isOwn && (
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gray-600 text-white text-xs">Tú</AvatarFallback>
                  </Avatar>
                )}
              </div>
              <div className="text-xs text-gray-400 ml-2 self-end">{message.time}</div>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </ScrollArea>
    </div>
  )
}

// Componente: Input de mensaje
function MessageInput({ value, onChange, onSend, loading }) {
  return (
    <div className="p-4 border-t border-gray-700 bg-gray-900 sticky bottom-0 z-10">
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Input
            placeholder="Escribe un mensaje..."
            value={value}
            onChange={onChange}
            className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 pr-10"
            onKeyDown={e => { if (e.key === 'Enter') onSend() }}
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="text-gray-400 hover:text-white"
          onClick={onSend}
          disabled={loading || !value.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Utilidad para crear un objeto contacto a partir de un usuario (emitter)
 /**
 * Crea un objeto de contacto a partir de la información de un usuario y un mensaje.
 * @param {Object} user - Objeto usuario (emitter) con campos _id, name, surname, image, etc.
 * @param {Object} msg - Mensaje recibido, usado para poblar el primer mensaje del contacto.
 * @returns {Object} Objeto contacto listo para la lista de contactos.
 */
function createContactFromUser(user, msg) {
  return {
    id: user._id, // ID único del usuario
    name: `${user.name || 'Nuevo'} ${user.surname || ''}`.trim(), // Nombre completo
    avatar: (user.name && user.surname) ? (user.name[0] + (user.surname[0] || '')).toUpperCase() : '?', // Iniciales
    color: "bg-orange-500", // Color por defecto
    image: user.image || undefined, // Imagen de perfil si existe
    active: false, // Estado de conexión
    lastSeen: '', // Última vez visto (puede ser implementado)
    status: '', // Estado personalizado (puede ser implementado)
    hasNewMessage: true, // Indica si hay mensajes nuevos
    messages: [
      {
        id: msg._id, // ID del mensaje
        sender: `${user.name || 'Nuevo'} ${user.surname || ''}`.trim(), // Nombre del remitente
        content: msg.text, // Contenido del mensaje
        time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), // Hora formateada
        isOwn: false // Indica si el mensaje es propio
      }
    ]
  };
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

  // Cargar mensajes recibidos y enviados y construir lista de contactos
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true)
      try {
        const token = getToken()
        const [receivedRes, emittedRes] = await Promise.all([
          getReceivedMessages(token),
          getEmittedMessages(token)
        ])
        const contactsArr = groupMessages(receivedRes?.messages, emittedRes?.messages)
        setContacts(contactsArr)
        // No seleccionar contacto por defecto
        // setSelectedContact(contactsArr[0] || null)
      } catch (e) {}
      setLoading(false)
    }
    fetchMessages()
  }, [])

  // Sincronizar mensajes del contacto seleccionado
  useEffect(() => {
    if (!selectedContact) return;
    const updated = contacts.find(c => c.id === selectedContact.id);
    if (updated && updated.messages.length !== messages.length) {
      setMessages(updated.messages || []);
    }
  }, [contacts, selectedContact, messages.length]);

  // Enviar mensaje
  const handleSend = useCallback(async () => {
    if (!messageInput.trim() || !selectedContact) return
    try {
      const res = await sendMessage({ text: messageInput, receiver: selectedContact.id })
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
        setContacts(prevContacts => prevContacts.map(c =>
          c.id === selectedContact.id
            ? {
                ...c,
                messages: [
                  ...c.messages,
                  {
                    id: res.message._id,
                    sender: 'Tú',
                    content: res.message.text,
                    time: new Date(res.message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: true
                  }
                ]
              }
          : c
        ))
        setMessageInput("")
      }
    } catch (e) {}
  }, [messageInput, selectedContact])

  // Al seleccionar contacto, limpiar hasNewMessage
  const handleSelectContact = useCallback((contact) => {
    setSelectedContact(contact)
    setMessages(contact.messages || [])
    setContacts(prevContacts => prevContacts.map(c =>
      c.id === contact.id
        ? {
            ...c,
            hasNewMessage: false,
            // Marcar todos los mensajes recibidos como leídos
            messages: c.messages.map(m => m.isOwn ? m : { ...m, read: true })
          }
        : c
    ))
  }, [])

  // Conectar y escuchar mensajes nuevos por websocket
  useEffect(() => {
    connectAndAuthenticate();
    /**
     * Handler para mensajes nuevos recibidos por websocket.
     * Si el contacto existe, agrega el mensaje; si no, crea un nuevo contacto con la info de msg.emitter.
     */
    const handleNewMessage = (msg) => {
      // DEBUG: Mostrar cómo llega el mensaje y los ids de contactos
      console.log('Mensaje entrante (ws):', msg);
      setContacts(prevContacts => {
        // Mostrar todos los contactos actuales para depuración
        console.log('Contactos actuales:', prevContacts);
        // El id correcto para comparar es msg.emitter._id
        const incomingId = msg.emitter && msg.emitter._id ? msg.emitter._id : undefined;
        console.log('Comparando incomingId:', incomingId, 'con contactos:', prevContacts.map(c => c.id));
        let foundIndex = prevContacts.findIndex(contact => contact.id === incomingId);
        let updatedContacts = [...prevContacts];
        if (foundIndex !== -1) {
          // Ya existe el contacto, agregar el mensaje si no está
          const contact = updatedContacts[foundIndex];
          const alreadyExists = contact.messages.some(m => m.id === msg._id);
          if (!alreadyExists) {
            // Crear objeto mensaje y agregarlo al contacto
            const newMsg = {
              id: msg._id,
              sender: contact.name,
              content: msg.text,
              time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isOwn: false
            };
            contact.messages = [...contact.messages, newMsg];
            contact.hasNewMessage = true;
            // Si el contacto no está al principio, lo movemos arriba
            updatedContacts.splice(foundIndex, 1);
            updatedContacts.unshift(contact);
          }
          // Si el contacto está seleccionado, actualizar mensajes en pantalla
          if (selectedContact && selectedContact.id === contact.id && !alreadyExists) {
            setMessages(prevMsgs =>
              prevMsgs.some(m => m.id === msg._id)
                ? prevMsgs
                : [...prevMsgs, {
                    id: msg._id,
                    sender: contact.name,
                    content: msg.text,
                    time: new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    isOwn: false
                  }]
            );
          }
        } else if (msg.emitter && msg.emitter._id) {
          // No existe el contacto, crear uno nuevo usando toda la info de msg.emitter
          updatedContacts.unshift(createContactFromUser(msg.emitter, msg));
        }
        return updatedContacts;
      });
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [selectedContact, userList]);

  // Modal para seleccionar usuario
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
            handleSelectContact({
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
    <div className="flex h-screen w-full bg-gray-900 text-white rounded-lg overflow-hidden flex-col md:flex-row">
    {/* Sidebar */}
    <div className="w-full md:w-80 bg-gray-800 border-r border-gray-700 flex-shrink-0">
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
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
        <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
      </div>

      <ContactList contacts={contacts} selectedContact={selectedContact} onSelect={handleSelectContact} />
    </div>
    {/* Main Chat Area */}
    <div className="flex-1 flex flex-col min-h-0 w-full max-w-full">
          <ChatHeader contact={selectedContact} />
          <MessageList messages={messages} selectedContact={selectedContact} />
          <MessageInput value={messageInput} onChange={e => setMessageInput(e.target.value)} onSend={handleSend} loading={loading} />
        </div>
    </div>
  </>
  )
}
