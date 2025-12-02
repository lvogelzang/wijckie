import type { DailyTodosModule, DailyTodoOption, DailyTodosWidget } from "@/api/models/api"
import type { WebAuthnAuthenticator } from "@/api/models/allauth"
import type { StaticUrlItem, VariableUrlItem } from "@/helpers/LinkTreeHelper"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const useLinkTree = () => {
    const { t } = useTranslation()

    return useMemo(() => {
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
        const ACCOUNT_LOGIN_WEBAUTHN: StaticUrlItem = {
            slug: "account/authenticate/webauthn",
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
        const DASHBOARD: StaticUrlItem = {
            slug: "dashboard",
            title: t("Dashboard.title"),
            hasPage: true,
        }
        const LOGOUT: StaticUrlItem = {
            slug: "account/logout",
            title: "",
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
        const MODULES__DAILY_TODOS__ID: VariableUrlItem = {
            variable: "moduleId",
            parent: MODULES__DAILY_TODOS,
            toTitle: (item) => (item as DailyTodosModule)?.name ?? "",
            hrefPart: (item) => (item as DailyTodosModule)?.id ?? "",
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS: StaticUrlItem = {
            slug: "options",
            parent: MODULES__DAILY_TODOS__ID,
            title: t("DailyTodoOption.plural_title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS__ID: VariableUrlItem = {
            variable: "optionId",
            parent: MODULES__DAILY_TODOS__ID__OPTIONS,
            toTitle: (item) => (item as DailyTodoOption)?.name ?? "",
            hrefPart: (item) => (item as DailyTodoOption)?.id ?? "",
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__OPTIONS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS__ID__OPTIONS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS: StaticUrlItem = {
            slug: "widgets",
            parent: MODULES__DAILY_TODOS__ID,
            title: t("DailyTodoWidget.plural_title"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS__ID: VariableUrlItem = {
            variable: "widgetId",
            parent: MODULES__DAILY_TODOS__ID__WIDGETS,
            toTitle: (item) => (item as DailyTodosWidget)?.name ?? "",
            hrefPart: (item) => (item as DailyTodosWidget)?.id ?? "",
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__ID__WIDGETS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS__ID__WIDGETS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__DAILY_TODOS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__DAILY_TODOS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION: StaticUrlItem = {
            slug: "inspiration",
            parent: MODULES,
            title: t("InspirationModule.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID: VariableUrlItem = {
            variable: "moduleId",
            parent: MODULES__INSPIRATION,
            toTitle: (item) => (item as DailyTodosModule)?.name ?? "",
            hrefPart: (item) => (item as DailyTodosModule)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS: StaticUrlItem = {
            slug: "options",
            parent: MODULES__INSPIRATION__ID,
            title: t("InspirationOption.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS__ID: VariableUrlItem = {
            variable: "optionId",
            parent: MODULES__INSPIRATION__ID__OPTIONS,
            toTitle: (item) => (item as DailyTodoOption)?.name ?? "",
            hrefPart: (item) => (item as DailyTodoOption)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__OPTIONS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION__ID__OPTIONS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS: StaticUrlItem = {
            slug: "widgets",
            parent: MODULES__INSPIRATION__ID,
            title: t("InspirationWidget.plural_title"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS__ID: VariableUrlItem = {
            variable: "widgetId",
            parent: MODULES__INSPIRATION__ID__WIDGETS,
            toTitle: (item) => (item as DailyTodosWidget)?.name ?? "",
            hrefPart: (item) => (item as DailyTodosWidget)?.id ?? "",
            hasPage: true,
        }
        const MODULES__INSPIRATION__ID__WIDGETS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION__ID__WIDGETS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }
        const MODULES__INSPIRATION__NEW: StaticUrlItem = {
            slug: "new",
            parent: MODULES__INSPIRATION,
            title: t("Breadcrumbs.new"),
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
        const MY_ACCOUNT__PASSKEYS__ID: VariableUrlItem = {
            variable: "passkeyId",
            parent: MY_ACCOUNT__PASSKEYS,
            toTitle: (item) => (item as WebAuthnAuthenticator)?.name ?? "",
            hrefPart: (item) => (item as WebAuthnAuthenticator)?.id ?? "",
            hasPage: true,
        }
        const MY_ACCOUNT__PASSKEYS__NEW: StaticUrlItem = {
            slug: "new",
            parent: MY_ACCOUNT__PASSKEYS,
            title: t("Breadcrumbs.new"),
            hasPage: true,
        }

        return {
            ACCOUNT_LOGIN_CODE,
            ACCOUNT_LOGIN_CODE_CONFIRM,
            ACCOUNT_LOGIN_WEBAUTHN,
            ACCOUNT_SIGNUP_PASSKEY,
            ACCOUNT_SIGNUP_PASSKEY_CREATE,
            ACCOUNT_VERIFY_EMAIL,
            DASHBOARD,
            LOGOUT,
            MODULES,
            MODULES__DAILY_TODOS,
            MODULES__DAILY_TODOS__ID,
            MODULES__DAILY_TODOS__ID__OPTIONS,
            MODULES__DAILY_TODOS__ID__OPTIONS__ID,
            MODULES__DAILY_TODOS__ID__OPTIONS__NEW,
            MODULES__DAILY_TODOS__ID__WIDGETS,
            MODULES__DAILY_TODOS__ID__WIDGETS__ID,
            MODULES__DAILY_TODOS__ID__WIDGETS__NEW,
            MODULES__DAILY_TODOS__NEW,
            MODULES__INSPIRATION,
            MODULES__INSPIRATION__ID,
            MODULES__INSPIRATION__ID__OPTIONS,
            MODULES__INSPIRATION__ID__OPTIONS__ID,
            MODULES__INSPIRATION__ID__OPTIONS__NEW,
            MODULES__INSPIRATION__ID__WIDGETS,
            MODULES__INSPIRATION__ID__WIDGETS__ID,
            MODULES__INSPIRATION__ID__WIDGETS__NEW,
            MODULES__INSPIRATION__NEW,
            MY_ACCOUNT,
            MY_ACCOUNT__EMAIL_ADDRESSES,
            MY_ACCOUNT__EMAIL_ADDRESSES__NEW,
            MY_ACCOUNT__PASSKEYS,
            MY_ACCOUNT__PASSKEYS__ID,
            MY_ACCOUNT__PASSKEYS__NEW,
        }
    }, [t])
}

export default useLinkTree
