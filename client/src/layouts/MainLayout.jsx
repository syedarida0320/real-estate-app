import React from "react";
import { SidebarProvider} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Navbar } from "@/components/navbar";

const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <div className="flex flex-col h-screen w-full overflow-hidden bg-gray-50">
        <Navbar />

        <div className="flex flex-1 overflow-hidden pt-1">
          <AppSidebar className="h-[calc(100vh-55px)] fixed left-0 top-[64px] " />

          <main className="flex-1 mt-[64px] pl-5 pr-7 overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
