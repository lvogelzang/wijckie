import { type FC } from "react"
import { useTranslation } from "react-i18next"

const DashboardPage: FC = () => {
    const { t } = useTranslation()

    return (
        <div>
            <h1>{t("DashboardPage.title")}</h1>
        </div>
    )
}

export default DashboardPage
