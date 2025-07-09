import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";
import { getUserName, getUserEmail, getUserImage } from "../global";

export const sidebarData = {
  appInfo :{
    name: "Red Social Leander"
  },
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/logo.jpg",
  },
  teams: [
    {
      name: "Leander",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    }
  ],
 navMain: [
    {
      title: "Home",
      url: "/aplicacion/home",
      icon: SquareTerminal,
      key: 'home'
    },
    {
      title: "Mensaje",
      url: "/aplicacion/mensaje",
      icon: Bot,
      key: 'mensaje'
    },
    {
      title: "Eventos",
      url: "/aplicacion/eventos",
      icon: AudioWaveform,
      key: 'eventos'
    },
    {
      title: "Foro",
      url: "/aplicacion/foro",
      icon: BookOpen,
      key: 'foro'
    },
    {
      title: "Notificaciones",
      url: "/aplicacion/notificaciones",
      icon: Settings2,
      key: 'notificaciones'
    },
    {
      title: "Anuncios",
      url: "/aplicacion/anuncios",
      icon: BookOpen,
      key: 'anuncios'
    }
  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};
