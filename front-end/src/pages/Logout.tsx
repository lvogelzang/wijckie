import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { deleteAllauthClientV1AuthSession } from "../api/endpoints/allauth"

const Logout = () => {
    const navigate = useNavigate()

    useEffect(() => {
        deleteAllauthClientV1AuthSession("browser").finally(() => navigate("/"))
    }, [navigate])

    return null
}

export default Logout
