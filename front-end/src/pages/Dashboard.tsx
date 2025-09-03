import { type FC } from "react"
import { useTranslation } from "react-i18next"
import { useWidgetsRetrieve } from "../api/endpoints/api"
import DailyTodosWidgetView from "../widgets/modules/dailyTodos/DailyTodosWidgetView"
import InspirationWidgetView from "../widgets/modules/inspiration/InspirationWidgetView"
import styles from "./Dashboard.module.scss"

const Dashboard: FC = () => {
    const { t } = useTranslation()

    const { data: widgets } = useWidgetsRetrieve()

    return (
        <div>
            <h1>{t("Dashboard.title")}</h1>
            <div className={styles.container}>
                {widgets?.dailyTodos.map((dailyTodos) => <DailyTodosWidgetView key={`DailyTodos_${dailyTodos.id}`} widget={dailyTodos} />)}
                {widgets?.inspiration.map((inspiration) => <InspirationWidgetView key={`Inspiration_${inspiration.id}`} widget={inspiration} />)}
            </div>
        </div>
    )
}

export default Dashboard
