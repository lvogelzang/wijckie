import type { UserType } from "./UserType"

export default interface UserSettingsType {
    authenticated: boolean
    user: UserType
}
