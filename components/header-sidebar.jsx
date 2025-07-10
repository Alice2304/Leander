'use client';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { sidebarData } from "@/lib/data/sidebar-data";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { MessageCircle } from "lucide-react";
import { socket, connectAndAuthenticate } from "@/lib/ws/notificactiones";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner"
import { Bell } from "lucide-react";

const HeaderSidebar = () => {
  const pathname = usePathname();
  // Extraer partes de la ruta (por ejemplo, '/home/feed' => ['home', 'feed'])
  const pathParts = pathname.split("/").filter(Boolean);
  let breadcrumbTitle = "Inicio";
    console.log(pathParts)
  for (const navItem of sidebarData.navMain) {
    if (navItem.items && Array.isArray(navItem.items)) {
      // Buscar coincidencia exacta en los subitems
      const foundSub = navItem.items.find(sub => pathParts.includes(sub.key));
      if (foundSub) {
        breadcrumbTitle = foundSub.title;
        break;
      }
    }
    if (navItem.url === pathParts[0]) {
      breadcrumbTitle = navItem.title;
      // Si no hay subitem, se queda con el título principal
    }
  }

  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [newMessages, setNewMessages] = useState([]);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const [newNotifications, setNewNotifications] = useState([]);
  const router = useRouter();
  const popoverRef = useRef();

  useEffect(() => {
    connectAndAuthenticate();
    const handleNewMessage = (msg) => {
      setHasNewMessage(true);
      setNewMessages(prev => [msg, ...prev]);
      // Mostrar toast de sonner al recibir un nuevo mensaje
      toast(`Nuevo mensaje de ${msg.emitterName || msg.sender || 'Contacto'}`, {
        description: msg.text || msg.content,
        action: {
          label: "Ver",
          onClick: () => {
            router.push("/aplicacion/mensaje");
            setHasNewMessage(false);
            setNewMessages([]);
          },
        },
      });
    };
    const handleNewNotification = (notif) => {
      setHasNewNotification(true);
      setNewNotifications(prev => [notif, ...prev]);
      toast("Nueva notificación", {
        description: notif.type === "like" ? "A alguien le gustó tu publicación" : notif.type,
        action: {
          label: "Ver",
          onClick: () => {
            router.push("/aplicacion/home");
            setHasNewNotification(false);
            setNewNotifications([]);
          },
        },
      });
    };
    socket.on("newMessage", handleNewMessage);
    socket.on("newNotification", handleNewNotification);
    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newNotification", handleNewNotification);
    };
  }, []);

  // Función para limpiar el badge (puedes llamarla desde el chat cuando se lean los mensajes)
  // const clearNewMessage = () => setHasNewMessage(false);

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 relative">
      <div className="flex items-center gap-2 px-4 w-full">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href="#">
                {sidebarData.appInfo.name}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage>{breadcrumbTitle}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {/* Icono de notificaciones al lado izquierdo del icono de mensajes */}
      <div className="fixed top-4 right-28 z-50">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative p-0 w-9 h-9 rounded-full">
              {/* Icono de campana de notificaciones */}
              <Bell className="w-7 h-7 text-gray-400" />
              {hasNewNotification && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 translate-x-1/2 -translate-y-1/2">Nuevo</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-2">
              <h4 className="font-medium text-lg mb-2">Notificaciones</h4>
              {newNotifications.length === 0 ? (
                <div className="text-gray-400 text-sm">No hay notificaciones nuevas</div>
              ) : (
                <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                  {newNotifications.map((notif, idx) => (
                    <li
                      key={notif._id || idx}
                      className="py-2 cursor-pointer hover:bg-gray-100/20 rounded"
                      onClick={() => {
                        setHasNewNotification(false);
                        setNewNotifications([]);
                      }}
                    >
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {notif.type === "like" ? "A alguien le gustó tu publicación" : notif.type}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {notif.created_at ? new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
      {/* Icono de mensaje con badge flotando al extremo derecho y popover */}
      <div className="fixed top-4 right-8 z-50">
        <Popover ref={popoverRef}>
          <PopoverTrigger asChild>
            <Button variant="ghost" className="relative p-0 w-9 h-9 rounded-full">
              <MessageCircle className="w-7 h-7 text-gray-400" />
              {hasNewMessage && (
                <span className="absolute top-0 right-0 bg-green-500 text-white text-xs rounded-full px-1.5 py-0.5 translate-x-1/2 -translate-y-1/2">Nuevo</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="grid gap-2">
              <h4 className="font-medium text-lg mb-2">Nuevos mensajes</h4>
              {newMessages.length === 0 ? (
                <div className="text-gray-400 text-sm">No hay mensajes nuevos</div>
              ) : (
                <ul className="max-h-60 overflow-y-auto divide-y divide-gray-200">
                  {newMessages.map((msg, idx) => (
                    <li
                      key={msg._id || idx}
                      className="py-2 cursor-pointer hover:bg-gray-100/20 rounded"
                      onClick={() => {
                        setHasNewMessage(false);
                        setNewMessages([]);
                      }}
                    >
                      <Link href="/aplicacion/mensaje" className="block w-full h-full">
                        <div className="font-semibold text-gray-900 dark:text-white">{msg.emitterName || msg.sender || 'Desconocido'}</div>
                        <div className="text-gray-700 dark:text-gray-300 text-sm">{msg.text || msg.content}</div>
                        <div className="text-xs text-gray-400 mt-1">{msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
};

export default HeaderSidebar;