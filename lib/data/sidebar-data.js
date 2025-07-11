import {
  CalendarCheck2,
  SquareChartGantt,
  Megaphone,
  MessageSquareText,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  House,
  Users,
} from "lucide-react";

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
      icon: House,
      key: 'home'
    },
    {
      title: "Mensaje",
      url: "/aplicacion/mensaje",
      icon: MessageSquareText,
      key: 'mensaje'
    },
    {
      title: "Eventos",
      url: "/aplicacion/eventos",
      icon: CalendarCheck2,
      key: 'eventos'
    },
    {
      title: "Foro",
      url: "/aplicacion/foro",
      icon: SquareChartGantt,
      key: 'foro'
    },
    {
      title: "Anuncios",
      url: "/aplicacion/anuncios",
      icon: Megaphone,
      key: 'anuncios'
    },
    {
      title: "Amigos",
      url: "/aplicacion/seguidores",
      icon: Users,
      key: 'seguidores'
    },
    {
      title: "Editar Perfil",
      url: "/aplicacion/editar",
      icon: Users,
      key: 'editar'
    }

  ],
  projects: [
    { name: "Design Engineering", url: "#", icon: Frame },
    { name: "Sales & Marketing", url: "#", icon: PieChart },
    { name: "Travel", url: "#", icon: Map },
  ],
};
