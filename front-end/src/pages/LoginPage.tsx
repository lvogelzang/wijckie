import type { FC } from "react"
import { Link } from "react-router-dom"

const LoginPage: FC = () => {
    return (
        <div>
            <h1>Login</h1>
            <Link to="/dashboard">Dashboard</Link>
        </div>
    )
}

export default LoginPage
