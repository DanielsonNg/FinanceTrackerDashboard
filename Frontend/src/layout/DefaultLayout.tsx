import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                <main className="w-full p-1">
                    <div className="flex w-full justify-between">
                        <SidebarTrigger />
                        <ModeToggle />
                    </div>
                    <Outlet />
                </main>
            </SidebarProvider>
        </>
    )
}