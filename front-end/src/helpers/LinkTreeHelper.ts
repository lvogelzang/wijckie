import type { BreadcrumbType } from "@/types/Breadcrumb"
import type { MenuId } from "@/types/MenuId"

export interface NavItem {
    urlItem: StaticUrlItem | VariableUrlItem
    args: unknown[]
}

export interface StaticUrlItem {
    tab?: MenuId
    parent?: StaticUrlItem | VariableUrlItem
    slug: string
    title: string
    hasPage: boolean
}

export interface VariableUrlItem {
    tab?: MenuId
    parent?: StaticUrlItem | VariableUrlItem
    variable: string
    toTitle: (arg?: unknown) => string
    hrefPart: (arg?: unknown) => string | number
    hasPage: boolean
}

const getPath = (slugs: string[]) => "/" + slugs.join("/")

const toHrefParts: (item: StaticUrlItem | VariableUrlItem, args: unknown[]) => string[] = (item, args) => {
    let part
    if ((item as VariableUrlItem).hrefPart) {
        const variableUrlItem = item as VariableUrlItem
        part = variableUrlItem.hrefPart(args.pop()).toString()
    } else if ((item as StaticUrlItem).slug) {
        const staticUrlItem = item as StaticUrlItem
        part = staticUrlItem.slug
    } else {
        part = ""
    }

    return item.parent ? [...toHrefParts(item.parent, args), part] : [part]
}

const toPathParts: (item: StaticUrlItem | VariableUrlItem) => string[] = (item) => {
    let part
    if ((item as VariableUrlItem).variable) {
        const variableUrlItem = item as VariableUrlItem
        part = `:${variableUrlItem.variable}`
    } else if ((item as StaticUrlItem).slug) {
        const staticUrlItem = item as StaticUrlItem
        part = staticUrlItem.slug
    } else {
        part = ""
    }

    return item.parent ? [...toPathParts(item.parent), part] : [part]
}

export const toBreadcrumbs: (item: StaticUrlItem | VariableUrlItem, args: unknown[]) => BreadcrumbType[] = (item, args) => {
    const href = item.hasPage ? getPath(toHrefParts(item, [...args])) : undefined
    let title

    if ((item as VariableUrlItem).toTitle) {
        const variableUrlItem = item as VariableUrlItem
        title = variableUrlItem.toTitle(args.pop())
    } else if ((item as StaticUrlItem).title) {
        const staticUrlItem = item as StaticUrlItem
        title = staticUrlItem.title
    } else {
        title = ""
    }

    const breadcrumb = { title, href }
    return item.parent ? [...toBreadcrumbs(item.parent, args), breadcrumb] : [breadcrumb]
}

export const toPageTitle = (item: StaticUrlItem | VariableUrlItem, args: unknown[]): string => {
    const argsCopy = [...args]
    if ((item as VariableUrlItem).toTitle) {
        const variableUrlItem = item as VariableUrlItem
        return variableUrlItem.toTitle(argsCopy.pop())
    } else if ((item as StaticUrlItem).title) {
        const staticUrlItem = item as StaticUrlItem
        return staticUrlItem.title
    } else {
        return ""
    }
}

export const makeUrl = (item: StaticUrlItem | VariableUrlItem, args: unknown[]): string => {
    return getPath(toHrefParts(item, args))
}

export const makePath = (item: StaticUrlItem | VariableUrlItem): string => {
    return getPath(toPathParts(item))
}

export const makeNavItem = (urlItem: StaticUrlItem | VariableUrlItem, args: unknown[]): NavItem => {
    return { urlItem, args }
}

export const getTab = (urlItem: StaticUrlItem | VariableUrlItem): MenuId | undefined => {
    if (urlItem.tab) {
        return urlItem.tab
    } else if (urlItem.parent) {
        return getTab(urlItem.parent)
    } else {
        return undefined
    }
}

export const getParentUrl = (item: StaticUrlItem | VariableUrlItem, args: unknown[]): string | undefined => {
    if (item.parent) {
        const argsCopy = [...args]
        if ((item as VariableUrlItem).toTitle) {
            argsCopy.pop()
        }
        if (!item.parent.hasPage) {
            return getParentUrl(item.parent, argsCopy)
        } else {
            return makeUrl(item.parent, argsCopy)
        }
    }
    return undefined
}
