import Footer from "@/components/footer/Footer"
import NavBar from "@/components/navbar/NavBar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

export default function Root() {
    return (
        <SidebarProvider defaultOpen={false} className="flex-col">
            <NavBar />
            <main className="grow flex">
                <Outlet />
            </main>
            <Footer />
        </SidebarProvider>
    )
}
