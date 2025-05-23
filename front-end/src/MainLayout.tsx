import type { FC } from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import DashboardPage from "./pages/DashboardPage"
import LoginPage from "./pages/LoginPage"

const MainLayout: FC = () => {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
    )
}

export default MainLayout
