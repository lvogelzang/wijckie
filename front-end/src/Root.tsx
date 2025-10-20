import { Outlet } from "react-router-dom"
import NavBar from "./components/navbar/NavBar"
import { SidebarProvider } from "./components/ui/sidebar"

export default function Root() {
    return (
        <SidebarProvider defaultOpen={false} className="flex-col">
            <NavBar />
            <main className="grow flex">
                <Outlet />
            </main>
            <footer className="text-center m-6">
                <span className="text-muted-foreground">&copy; Studio Goes</span>
            </footer>
        </SidebarProvider>
    )
}
