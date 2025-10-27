import { Page } from "@/components/Page"
import type { FC } from "react"
import { useTranslation } from "react-i18next"
import DailyTodosModuleTable from "../../tables/modules/dailyTodos/DailyTodosModuleTable"
import InspirationModuleTable from "../../tables/modules/inspiration/InspirationModuleTable"

const Modules: FC = () => {
    const { t } = useTranslation()

    return (
        <Page variant="configuration">
            <div>
                <h1>{t("Modules.title")}</h1>
                <InspirationModuleTable />
                <DailyTodosModuleTable />
            </div>
        </Page>
    )
}

export default Modules
