import { type FC } from "react"
import { Link } from "react-router-dom"

const DashboardPage: FC = () => {
    return (
        <div>
            <h1>Dashboard</h1>
            <Link to="/logout">Logout</Link>
        </div>
    )
}

export default DashboardPage
