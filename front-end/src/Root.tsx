import { Outlet } from "react-router-dom"
import NavBar from "./components/navbar/NavBar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function Root() {
    return (
        <SidebarProvider defaultOpen={false} className="flex-col">
            <NavBar />
            <main>
                <Outlet />
            </main>
            <footer>
                <span className="text-body-secondary">&copy; Studio Goes</span>
            </footer>
        </SidebarProvider>
    )
}
