import Axios, { AxiosError, type AxiosRequestConfig } from "axios"
import Cookies from "js-cookie"

const AXIOS_INSTANCE = Axios.create({ responseType: "json", baseURL: import.meta.env.VITE_APP_API_URL })

AXIOS_INSTANCE.interceptors.request.use((config) => {
    const baseUrl = import.meta.env.VITE_APP_API_URL
    config.url = `${baseUrl}${config.url}`
    config.withCredentials = true
    if (config.url !== "/config") {
        const csrf = Cookies.get("csrftoken")
        if (csrf) {
            config.headers["X-CSRFTOKEN"] = csrf
        }
    }

    return config
})

export const customInstance = <T>(config: AxiosRequestConfig, options?: AxiosRequestConfig): Promise<T> => {
    const promise = AXIOS_INSTANCE({
        ...config,
        ...options,
    })
        .then(({ data }) => data)
        .catch((error: AxiosError) => {
            if (error.response) {
                const response = error.response
                const status = response.status
                const data = response.data
                let authenticated = false
                if (data instanceof Object && "meta" in data) {
                    const meta = data.meta
                    if (meta instanceof Object && "is_authenticated" in meta) {
                        const isAuthenticated = meta.is_authenticated
                        if (typeof isAuthenticated === "boolean") {
                            authenticated = isAuthenticated
                        }
                    }
                }
                if ([401, 410].includes(status) || (status === 200 && authenticated)) {
                    const event = new CustomEvent("allauth.auth.change", { detail: data })
                    document.dispatchEvent(event)
                }
            }
            throw error
        })

    return promise
}
