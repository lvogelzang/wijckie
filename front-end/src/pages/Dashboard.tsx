import { type FC } from "react"
import { useTranslation } from "react-i18next"

const Dashboard: FC = () => {
    const { t } = useTranslation()

    return (
        <div>
            <h1>{t("Dashboard.title")}</h1>
        </div>
    )
}

export default Dashboard
