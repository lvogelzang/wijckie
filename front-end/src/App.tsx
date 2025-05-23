import "bootstrap/dist/js/bootstrap.js"
import { BrowserRouter } from "react-router-dom"
import MainLayout from "./MainLayout"
import "./sass/main.scss"

function App() {
    return (
        <BrowserRouter>
            <MainLayout />
        </BrowserRouter>
    )
}

export default App
