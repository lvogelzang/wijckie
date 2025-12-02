import type { DailyTodosWidget } from "@/api/models/api"
import type { StaticUrlItem, VariableUrlItem } from "@/helpers/LinkTreeHelper"
import { useMemo } from "react"
import { useTranslation } from "react-i18next"

const useLinkTree = () => {
    const { t } = useTranslation()

    return useMemo(() => {
        const ACCOUNT_LOGIN_WEBAUTHN: StaticUrlItem = {
            slug: "account/authenticate/webauthn",
            title: "",
            hasPage: true,
        }

        const MODULES__INSPIRATION__ID__WIDGETS__ID: VariableUrlItem = {
            variable: "widgetId",
            parent: "ACCOUNT_LOGIN_WEBAUTHN",
            toTitle: (item) => (item as DailyTodosWidget)?.name ?? "",
            hrefPart: (item) => (item as DailyTodosWidget)?.id ?? "",
            hasPage: true,
        }

        return {
            ACCOUNT_LOGIN_WEBAUTHN,
            MODULES__INSPIRATION__ID__WIDGETS__ID,
        }
    }, [t])
}

export default useLinkTree
