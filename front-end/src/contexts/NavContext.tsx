import { getParentUrl, getTab, toBreadcrumbs, toPageTitle, type NavItem } from "@/helpers/LinkTreeHelper"
import type { BreadcrumbType } from "@/types/Breadcrumb"
import type { MenuId } from "@/types/MenuId"
import { createContext, useContext, useMemo, useState, type ReactNode } from "react"

interface NavProviderProps {
    children: ReactNode
}

interface NavContextProps {
    activeTab: MenuId | undefined
    breadcrumbs: BreadcrumbType[]
    pageTitle: string
    parentUrl: string | undefined
    setCurrentNav: (nav: NavItem) => void
}

const contextValue = {
    activeTab: undefined,
    breadcrumbs: [],
    pageTitle: "",
    parentUrl: undefined,
    setCurrentNav: () => {},
}

export const NavContext = createContext<NavContextProps>(contextValue)

export const NavProvider = ({ children }: NavProviderProps) => {
    const [currentNav, setCurrentNav] = useState<NavItem>({ urlItem: { slug: "", title: "", hasPage: false }, args: [] })

    const activeTab = useMemo(() => getTab(currentNav.urlItem), [currentNav])
    const breadcrumbs = useMemo(() => toBreadcrumbs(currentNav.urlItem, currentNav.args), [toBreadcrumbs, currentNav])
    const pageTitle = useMemo(() => toPageTitle(currentNav.urlItem, currentNav.args), [toPageTitle, currentNav])
    const parentUrl = useMemo(() => getParentUrl(currentNav.urlItem, currentNav.args), [currentNav])

    return <NavContext.Provider value={{ activeTab, breadcrumbs, pageTitle, parentUrl, setCurrentNav }}>{children}</NavContext.Provider>
}

export const NavConsumer = NavContext.Consumer

export const useNav = () => {
    return useContext(NavContext)
}
