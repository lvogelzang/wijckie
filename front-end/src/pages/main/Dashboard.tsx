import Loader from "@/components/Loader"
import { Page } from "@/components/Page"
import DailyTodosWidgetView from "@/widgets/modules/dailyTodos/DailyTodosWidgetView"
import InspirationWidgetView from "@/widgets/modules/inspiration/InspirationWidgetView"
import { useTranslation } from "react-i18next"
import { useWidgetsRetrieve } from "../../api/endpoints/api"

const Dashboard = () => {
    const { t } = useTranslation()

    const { data: widgets } = useWidgetsRetrieve()

    return (
        <Page variant="dashboard">
            <h1>{t("Dashboard.title")}</h1>
            {!widgets ? (
                <Loader />
            ) : (
                <div className="gap-4 columns-1 md:columns-2 xl:columns-3">
                    {widgets.dailyTodos.map((dailyTodos) => (
                        <DailyTodosWidgetView key={`DailyTodos_${dailyTodos.id}`} widget={dailyTodos} />
                    ))}
                    {widgets.inspiration.map((inspiration) => (
                        <InspirationWidgetView key={`Inspiration_${inspiration.id}`} widget={inspiration} />
                    ))}
                </div>
            )}
        </Page>
    )
}

export default Dashboard
