import { Page } from "@/components/Page"
import { useParams } from "react-router-dom"
import { useDailyTodosModulesRetrieve, useDailyTodosWidgetsRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import DailyTodosWidgetForm from "../../../forms/modules/dailyTodos/DailyTodosWidgetForm"

interface Props {
    mode: "Create" | "Update"
}

const DailyTodosWidgetPage = ({ mode }: Props) => {
    const { moduleId, widgetId } = useParams()

    const { data: module } = useDailyTodosModulesRetrieve(parseInt(moduleId!))
    const { data: widget, isRefetching } = useDailyTodosWidgetsRetrieve(parseInt(widgetId!), { query: { enabled: mode === "Update" } })

    if (mode === "Create" && !module) {
        return <Loader />
    } else if (mode === "Update" && (!widget || isRefetching)) {
        return <Loader />
    }

    return (
        <Page variant="configuration">
            <div>
                <DailyTodosWidgetForm mode={mode} module={module!} widget={widget} />
            </div>
        </Page>
    )
}

export default DailyTodosWidgetPage
