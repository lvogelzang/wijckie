import type UserSettingsType from "../types/UserSettingsType"
import api from "./Api"

export function csrf() {
    return api.get("/auth/csrf/")
}

export function me() {
    return api.get<UserSettingsType>("/auth/me/")
}

export function login(email: string, password: string) {
    const form = new FormData()
    form.append("username", email)
    form.append("password", password)

    return api.post("/auth/login/", form)
}

export function logout() {
    return api.post("/auth/logout/")
}
