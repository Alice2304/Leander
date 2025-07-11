"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Send } from "lucide-react"
import { socket, connectAndAuthenticate } from "@/lib/ws/notificactiones"

export default function Component() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "agent",
      content: "Hi, how can I help you today?",
      timestamp: "now",
    },
     {
      id: 2,
      sender: "user",
      content: "Hey, I'm having trouble with my account.",
      timestamp: "now",
    },
    {
      id: 3,
      sender: "agent",
      content: "What seems to be the problem?",
      timestamp: "now",
    },
    {
      id: 4,
      sender: "user",
      content: "I can't log in.",
      timestamp: "now",
    },
  ])

  useEffect(() => {
    connectAndAuthenticate();
    const handleNewMessage = (msg) => {
      setMessages(prev => [
        ...prev,
        {
          id: msg._id,
          sender: "agent", // O usa msg.emitter si tienes lógica para distinguir
          content: msg.text,
          timestamp: msg.created_at || "now"
        }
      ])
    }
    socket.on("newMessage", handleNewMessage)
    return () => {
      socket.off("newMessage", handleNewMessage)
    }
  }, [])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Emitir el mensaje por websocket
      socket.emit("sendMessage", { text: message });
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          sender: "user",
          content: message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setMessage("");
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  return (
    <div className="w-full max-w-md mx-auto bg-gray-900 text-white rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sofia Davis" />
            <AvatarFallback className="bg-gray-600 text-white">SD</AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-white">Sofia Davis</h3>
            <p className="text-sm text-gray-400">m@example.com</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 space-y-4 h-80 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-xs px-4 py-2 rounded-2xl ${
                msg.sender === "user" ? "bg-gray-200 text-gray-900 rounded-br-md" : "bg-transparent text-white"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message..."
            className="flex-1 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-gray-500"
          />
          <Button onClick={handleSendMessage} size="icon" className="bg-gray-700 hover:bg-gray-600 text-white">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
