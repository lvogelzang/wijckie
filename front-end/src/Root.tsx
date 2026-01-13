import Footer from "@/components/footer/Footer"
import NavBar from "@/components/navbar/NavBar"
import AppSidebar from "@/components/sidebar/AppSidebar"
import { useCallback, useState } from "react"
import { Outlet } from "react-router-dom"

export default function Root() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const toggleSidebarOpen = useCallback(() => setSidebarOpen((oldValue) => !oldValue), [setSidebarOpen])

    return (
        <AppSidebar open={sidebarOpen} toggleOpen={toggleSidebarOpen} className="flex flex-col min-h-dvh">
            <NavBar toggleSidebar={toggleSidebarOpen} />
            <main className="grow flex">
                <Outlet />
            </main>
            <Footer />
        </AppSidebar>
    )
}
