import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Bell, Shield, CheckCircle, MessageSquare, MoreHorizontal } from "lucide-react"

const notifications = [
	{
		id: "1",
		type: "report",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "Tenemos noticias sobre tu denuncia de Sebastian Vasquez.",
		time: "10 h",
		isRead: false,
		icon: <Bell className="w-4 h-4" />,
	},
	{
		id: "2",
		type: "memory",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "Viaja al pasado con tu publicación del abril de 2020.",
		time: "4 d",
		isRead: false,
		icon: <Bell className="w-4 h-4" />,
	},
	{
		id: "3",
		type: "confirmation",
		avatar: "/placeholder.svg?height=40&width=40",
		username: "Carlos Eduardo",
		message:
			"ha confirmado que está bien durante Inundaciones en San Cristóbal, Táchira, Venezuela.",
		time: "6 d",
		isRead: false,
		icon: <CheckCircle className="w-4 h-4 text-green-500" />,
	},
	{
		id: "4",
		type: "security",
		avatar: "/placeholder.svg?height=40&width=40",
		message: "Has aprobado un inicio de sesión.",
		time: "1 sem",
		isRead: false,
		icon: <Shield className="w-4 h-4 text-blue-500" />,
	},
	{
		id: "5",
		type: "post",
		avatar: "/placeholder.svg?height=40&width=40",
		username: "Alex Aular",
		message: "ha publicado 2 enlaces.",
		time: "1 sem",
		isRead: false,
		icon: <MessageSquare className="w-4 h-4" />,
	},
]

const newNotifications = notifications.slice(0, 1)
const previousNotifications = notifications.slice(1)

function NotificationItem({ notification }) {
	return (
		<div className="flex items-start gap-3 p-3 hover:bg-gray-800/50 rounded-lg transition-colors">
			<div className="relative">
				<Avatar className="w-10 h-10">
					<AvatarImage src={notification.avatar || "/placeholder.svg"} />
					<AvatarFallback className="bg-gray-700 text-gray-300">
						{notification.username ? notification.username[0] : "N"}
					</AvatarFallback>
				</Avatar>
				{notification.icon && (
					<div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1 border border-gray-700">
						{notification.icon}
					</div>
				)}
			</div>

			<div className="flex-1 min-w-0">
				<p className="text-sm text-gray-200 leading-relaxed">
					{notification.username && (
						<span className="font-semibold text-white">
							{notification.username}{" "}
						</span>
					)}
					{notification.message}
				</p>
				<p className="text-xs text-gray-400 mt-1">{notification.time}</p>
			</div>

			{!notification.isRead && (
				<div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
			)}
		</div>
	)
}

export default function SocialNotifications() {
	return (
		<div className="w-full min-h-screen flex justify-center bg-gray-900 pt-8">
			<Card className="w-full h-auto max-w-2xl bg-gray-900 border-gray-800 text-white rounded-lg shadow-lg">
				<CardHeader className="pb-3">
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg font-semibold text-white">
							Notificaciones
						</CardTitle>
						<Button
							variant="ghost"
							size="icon"
							className="text-gray-400 hover:text-white hover:bg-gray-800"
						>
							<MoreHorizontal className="w-5 h-5" />
						</Button>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<Tabs defaultValue="todas" className="w-full h-full">
						<TabsContent value="todas" className="mt-0">
							<div className="space-y-1">
								{/* Nuevas */}
								<div className="px-6 py-2">
									<h3 className="text-sm font-semibold text-white mb-3">
										Nuevas
									</h3>
									<div className="space-y-1">
										{newNotifications.map((notification) => (
											<NotificationItem
												key={notification.id}
												notification={notification}
											/>
										))}
									</div>
								</div>

								{/* Anteriores */}
								<div className="px-6 py-2">
									<h3 className="text-sm font-semibold text-white mb-3">
										Anteriores
									</h3>
									<div className="space-y-1">
										{previousNotifications.map((notification) => (
											<NotificationItem
												key={notification.id}
												notification={notification}
											/>
										))}
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="no-leidas" className="mt-0">
							<div className="px-6 py-4">
								<div className="space-y-1">
									{notifications
										.filter((n) => !n.isRead)
										.map((notification) => (
											<NotificationItem
												key={notification.id}
												notification={notification}
											/>
										))}
								</div>
							</div>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>
		</div>
	)
}
