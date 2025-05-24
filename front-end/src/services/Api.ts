import axios from "axios"
import Cookies from "js-cookie"

let api = axios.create({
    responseType: "json",
})

api.interceptors.request.use((config) => {
    const baseUrl = import.meta.env.VITE_APP_API_URL
    config.url = `${baseUrl}${config.url}`
    config.withCredentials = true

    const csrf = Cookies.get("csrftoken")
    if (csrf) {
        config.headers["X-CSRFTOKEN"] = csrf
    }
    return config
})

export default api
