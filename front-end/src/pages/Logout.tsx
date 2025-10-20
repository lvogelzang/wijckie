import { isAllauthResponse401 } from "@/helpers/AllauthHelper"
import { useCallback } from "react"
import { deleteAllauthClientV1AuthSession } from "../api/endpoints/allauth"

const Logout = () => {
    const onSuccess = useCallback(() => console.log("Logged out succesfully"), [])

    const onFailure = useCallback(
        (error: unknown) => {
            if (isAllauthResponse401(error)) {
                onSuccess()
                return
            }
            console.error(error)
        },
        [onSuccess]
    )

    deleteAllauthClientV1AuthSession("browser").then(onSuccess).catch(onFailure)

    return null
}

export default Logout
