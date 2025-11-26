import { Page } from "@/components/Page"
import DailyTodosModuleTable from "@/tables/modules/dailyTodos/DailyTodosModuleTable"
import InspirationModuleTable from "@/tables/modules/inspiration/InspirationModuleTable"
import { useTranslation } from "react-i18next"

const Modules = () => {
    const { t } = useTranslation()

    return (
        <Page variant="configuration">
            <div>
                <h1>{t("Modules.title")}</h1>
                <InspirationModuleTable titleStyle="Section" />
                <DailyTodosModuleTable titleStyle="Section" />
            </div>
        </Page>
    )
}

export default Modules
