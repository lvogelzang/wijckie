import type { WebAuthnAuthenticator } from "@/api/models/allauth"
import type { DailyTodoOption, DailyTodosModule, DailyTodosWidget } from "@/api/models/api"
import type { BreadcrumbType } from "@/types/Breadcrumb"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

interface StaticUrlItem {
    parent?: StaticUrlItem | VariableUrlItem
    slug: string
    title: string
    hasPage: boolean
}

interface VariableUrlItem {
    parent?: StaticUrlItem | VariableUrlItem
    variable: string
    toTitle: (arg?: unknown) => string
    hrefPart: (arg?: unknown) => string | number
    hasPage: boolean
}

const useLinkTree = () => {
    const { t } = useTranslation()

    return useMemo(() => {
        const ACCOUNT_LOGIN_WEBAUTHN: StaticUrlItem = {
            slug: "account/authenticate/webauthn",
            title: "",
            hasPage: true,
        }
        const ACCOUNT_LOGIN_CODE: StaticUrlItem = {
            slug: "account/login/code",
            title: "",
            hasPage: true,
        }
        const ACCOUNT_LOGIN_CODE_CONFIRM: StaticUrlItem = {
            slug: "account/login/code/confirm",
            title: "",
            hasPage: true,
        }
        const ACCOUNT_SIGNUP_PASSKEY: StaticUrlItem = {
            slug: "account/signup/passkey",
            title: "",
            hasPage: true,
        }
        const ACCOUNT_SIGNUP_PASSKEY_CREATE: StaticUrlItem = {
            slug: "account/signup/passkey/create",
            title: "",
            hasPage: true,
        }
        const ACCOUNT_VERIFY_EMAIL: StaticUrlItem = {
            slug: "account/verify-email",
            title: "",
            hasPage: true,
        }
        const MY_ACCOUNT: StaticUrlItem = {
            slug: "account/my",
            title: t("MyAccount.title"),
            hasPage: true,
        }
        const MY_ACCOUNT__EMAIL_ADDRESSES: StaticUrlItem = {
            slug: "email-addresses",
            parent: MY_ACCOUNT,
            title: t("MyAccount.email_addresses"),
            hasPage: false,
        }
        const MY_ACCOUNT__EMAIL_ADDRESSES__NEW: StaticUrlItem = {
            slug: "new",
            parent: MY_ACCOUNT__EMAIL_ADDRESSES,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MY_ACCOUNT__PASSKEYS: StaticUrlItem = {
            slug: "passkeys",
            parent: MY_ACCOUNT,
            title: t("MyAccount.passkeys"),
            hasPage: false,
        }
        const MY_ACCOUNT__PASSKEYS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MY_ACCOUNT__PASSKEYS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MY_ACCOUNT__PASSKEYS__ID: VariableUrlItem = {
            variable: "passkeyId",
            parent: MY_ACCOUNT__PASSKEYS,
            toTitle: (item?: unknown) => (item as WebAuthnAuthenticator)?.name ?? "",
            hrefPart: (item?: unknown) => (item as WebAuthnAuthenticator)?.id ?? "",
            hasPage: true,
        }
        const LOGOUT: StaticUrlItem = {
            slug: "account/logout",
            title: "",
            hasPage: true,
        }
        const DASHBOARD: StaticUrlItem = {
            slug: "dashboard",
            title: t("Dashboard.title"),
            hasPage: true,
        }
        const MODULES: StaticUrlItem = {
            slug: "modules",
            title: t("Modules.title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS: StaticUrlItem = {
            slug: "daily-todos",
            parent: MODULES,
            title: t("DailyTodosModule.plural_title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID: VariableUrlItem = {
            variable: "moduleId",
            parent: MODULES__DAILY_TODOS,
            toTitle: (item?: unknown) => (item as DailyTodosModule)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodosModule)?.id ?? "",
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS: StaticUrlItem = {
            slug: "options",
            parent: MODULES__DAILY_TODOS__ID,
            title: t("DailyTodoOption.plural_title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS__ID__OPTIONS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS__ID: VariableUrlItem = {
            variable: "optionId",
            parent: MODULES__DAILY_TODOS__ID__OPTIONS,
            toTitle: (item?: unknown) => (item as DailyTodoOption)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodoOption)?.id ?? "",
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS: StaticUrlItem = {
            slug: "widgets",
            parent: MODULES__DAILY_TODOS__ID,
            title: t("DailyTodoWidget.plural_title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS__ID__WIDGETS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS__ID: VariableUrlItem = {
            variable: "widgetId",
            parent: MODULES__DAILY_TODOS__ID__WIDGETS,
            toTitle: (item?: unknown) => (item as DailyTodosWidget)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodosWidget)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION: StaticUrlItem = {
            slug: "inspiration",
            parent: MODULES,
            title: t("InspirationModule.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID: VariableUrlItem = {
            variable: "moduleId",
            parent: MODULES__INSPIRATION,
            toTitle: (item?: unknown) => (item as DailyTodosModule)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodosModule)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS: StaticUrlItem = {
            slug: "options",
            parent: MODULES__INSPIRATION__ID,
            title: t("InspirationOption.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION__ID__OPTIONS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS__ID: VariableUrlItem = {
            variable: "optionId",
            parent: MODULES__INSPIRATION__ID__OPTIONS,
            toTitle: (item?: unknown) => (item as DailyTodoOption)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodoOption)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS: StaticUrlItem = {
            slug: "widgets",
            parent: MODULES__INSPIRATION__ID,
            title: t("InspirationWidget.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION__ID__WIDGETS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS__ID: VariableUrlItem = {
            variable: "widgetId",
            parent: MODULES__INSPIRATION__ID__WIDGETS,
            toTitle: (item?: unknown) => (item as DailyTodosWidget)?.name ?? "",
            hrefPart: (item?: unknown) => (item as DailyTodosWidget)?.id ?? "",
            hasPage: true,
        }
        return {
            ACCOUNT_LOGIN_WEBAUTHN,
            ACCOUNT_LOGIN_CODE,
            ACCOUNT_LOGIN_CODE_CONFIRM,
            ACCOUNT_SIGNUP_PASSKEY,
            ACCOUNT_SIGNUP_PASSKEY_CREATE,
            ACCOUNT_VERIFY_EMAIL,
            MY_ACCOUNT,
            MY_ACCOUNT__EMAIL_ADDRESSES,
            MY_ACCOUNT__EMAIL_ADDRESSES__NEW,
            MY_ACCOUNT__PASSKEYS,
            MY_ACCOUNT__PASSKEYS__NEW,
            MY_ACCOUNT__PASSKEYS__ID,
            LOGOUT,
            DASHBOARD,
            MODULES,
            MODULES__DAILY_TODOS,
            MODULES__DAILY_TODOS__NEW,
            MODULES__DAILY_TODOS__ID,
            MODULES__DAILY_TODOS__ID__OPTIONS,
            MODULES__DAILY_TODOS__ID__OPTIONS__NEW,
            MODULES__DAILY_TODOS__ID__OPTIONS__ID,
            MODULES__DAILY_TODOS__ID__WIDGETS,
            MODULES__DAILY_TODOS__ID__WIDGETS__NEW,
            MODULES__DAILY_TODOS__ID__WIDGETS__ID,
            MODULES__INSPIRATION,
            MODULES__INSPIRATION__NEW,
            MODULES__INSPIRATION__ID,
            MODULES__INSPIRATION__ID__OPTIONS,
            MODULES__INSPIRATION__ID__OPTIONS__NEW,
            MODULES__INSPIRATION__ID__OPTIONS__ID,
            MODULES__INSPIRATION__ID__WIDGETS,
            MODULES__INSPIRATION__ID__WIDGETS__NEW,
            MODULES__INSPIRATION__ID__WIDGETS__ID,
        }
    }, [t])
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

export const makeUrl = (item: StaticUrlItem | VariableUrlItem, args: unknown[]): string => {
    return getPath(toHrefParts(item, args))
}

export const makePath = (item: StaticUrlItem | VariableUrlItem): string => {
    return getPath(toPathParts(item))
}

export default useLinkTree
