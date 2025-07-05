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

  return (
    <header
      className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
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
    </header>
  );
};

export default HeaderSidebar;