import "bootstrap/dist/js/bootstrap.js"
import { BrowserRouter } from "react-router-dom"
import { UserSettingsProvider } from "./contexts/UserSettingsContext"
import MainLayout from "./MainLayout"
import "./sass/main.scss"

function App() {
    return (
        <BrowserRouter>
            <UserSettingsProvider>
                <MainLayout />
            </UserSettingsProvider>
        </BrowserRouter>
    )
}

export default App
