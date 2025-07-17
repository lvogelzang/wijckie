import { Outlet } from "react-router-dom"
import NavBar from "./components/NavBar"

export default function Root() {
    return (
        <>
            <NavBar />
            <main>
                <Outlet />
            </main>
            <footer>
                <span className="text-body-secondary">&copy; Studio Goes</span>
            </footer>
        </>
    )
}
