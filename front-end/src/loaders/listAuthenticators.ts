import { getAllauthClientV1AccountAuthenticators } from "../api/endpoints/allauth"

export const listAuthenticators = () => {
    return new Promise((resolve, reject) => {
        getAllauthClientV1AccountAuthenticators("browser")
            .then((response) => resolve(response.data))
            .catch(reject)
    })
}
