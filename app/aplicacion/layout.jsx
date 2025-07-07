import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import HeaderSidebar from "@/components/header-sidebar";

export const metadata = {
  title: "Leander - Aplicación",
  description: "Leander es una red social para estudiantes",
};

export default function AplicacionLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar/>
      <SidebarInset>
        <HeaderSidebar />
        <div className="p-4">
          <div className="flex flex-col gap-4">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
