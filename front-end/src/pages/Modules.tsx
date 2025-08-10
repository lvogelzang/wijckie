import type { FC } from "react"
import { useTranslation } from "react-i18next"
import InspirationModuleTable from "../tables/InspirationModuleTable"

const Modules: FC = () => {
    const { t } = useTranslation()

    return (
        <div>
            <h1>{t("Modules.title")}</h1>
            <InspirationModuleTable />
        </div>
    )
}

export default Modules
