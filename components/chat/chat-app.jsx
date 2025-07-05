"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MoreHorizontal, Edit, Phone, Video, Info, Send } from "lucide-react"

const contacts = [
	{
		id: 1,
		name: "Jane Doe",
		status: "Jane: Escribiendo...",
		avatar: "JD",
		color: "bg-orange-500",
		active: true,
		lastSeen: "Activa hace 2 min",
	},
	{
		id: 2,
		name: "John Doe",
		status: "",
		avatar: "JD",
		color: "bg-pink-500",
	},
	{
		id: 3,
		name: "Elizabeth Smith",
		status: "",
		avatar: "ES",
		color: "bg-yellow-500",
	},
	{
		id: 4,
		name: "John Smith",
		status: "",
		avatar: "JS",
		color: "bg-green-500",
	},
]

const messages = [
	{
		id: 1,
		sender: "Jane Doe",
		content: "¿Cómo ha ido tu día hasta ahora?",
		time: "10:08 AM",
		isOwn: false,
	},
	{
		id: 2,
		sender: "You",
		content: "Ha ido bien, salí a correr esta mañana y luego tomé un buen desayuno. ¿Y tú?",
		time: "10:10 AM",
		isOwn: true,
	},
	{
		id: 3,
		sender: "Jane Doe",
		content: "¡Genial! Yo estoy relajándome afuera.",
		time: "10:20 PM",
		isOwn: false,
	},
]

export default function ChatApp() {
	const [selectedContact, setSelectedContact] = useState(contacts[0])
	const [messageInput, setMessageInput] = useState("")

	return (
		<div className="flex h-screen w-full bg-gray-900 text-white rounded-lg overflow-hidden">
			{/* Sidebar */}
			<div className="w-80 bg-gray-800 border-r border-gray-700">
				{/* Header */}
				<div className="flex items-center justify-between p-4 border-b border-gray-700">
					<h2 className="text-lg font-semibold">Chats (4)</h2>
					<div className="flex items-center gap-2">
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
						>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
						>
							<Edit className="h-4 w-4" />
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
									selectedContact.id === contact.id
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
												className={`${selectedContact.color} text-white text-xs`}
											>
												{selectedContact.avatar}
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
							/>
						</div>

						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white"
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
