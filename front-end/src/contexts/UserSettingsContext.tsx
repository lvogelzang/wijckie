import { createContext, useCallback, useContext, useMemo, useState, type FC, type ReactNode } from "react"
import { csrf, me } from "../services/User"
import type UserSettingsType from "../types/UserSettingsType"

interface UserSettingsContextProps {
    loading: boolean
    userSettings?: UserSettingsType
    reloadUserSettings: () => void
}

const contextValue = {
    loading: false,
    userSettings: undefined,
    reloadUserSettings: () => {},
}

export const UserSettingsContext = createContext<UserSettingsContextProps>(contextValue)

interface Props {
    children: ReactNode
}

export const UserSettingsProvider: FC<Props> = ({ children }) => {
    const [userSettings, setUserSettings] = useState<UserSettingsType>()

    const loading = useMemo(() => !userSettings, [userSettings])

    const reloadUserSettings = useCallback(() => {
        me()
            .then((response) => setUserSettings(response.data))
            .catch(() => setUserSettings(undefined))
    }, [setUserSettings])

    return <UserSettingsContext.Provider value={{ loading, userSettings, reloadUserSettings }} children={children} />
}

export const UserSettingsConsumer = UserSettingsContext.Consumer

export const useOptionalCurrentUser = () => {
    const { userSettings } = useContext(UserSettingsContext)
    return userSettings ? userSettings.user : undefined
}

export const useCurrentUser = () => {
    const currentUser = useOptionalCurrentUser()
    return currentUser!
}

export const useIsAuthenticated = () => {
    const currentUser = useOptionalCurrentUser()
    return !!currentUser
}

export const ensureCsrfToken = () => {
    csrf()
}
