import type { FC } from "react"
import { useTranslation } from "react-i18next"
import DailyTodosModuleTable from "../tables/DailyTodosModuleTable"
import InspirationModuleTable from "../tables/InspirationModuleTable"

const Modules: FC = () => {
    const { t } = useTranslation()

    return (
        <div>
            <h1>{t("Modules.title")}</h1>
            <InspirationModuleTable />
            <DailyTodosModuleTable />
        </div>
    )
}

export default Modules
