import { Page } from "@/components/Page"
import { useParams } from "react-router-dom"
import { useInspirationModulesRetrieve, useInspirationWidgetsRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import InspirationWidgetForm from "../../../forms/modules/inspiration/InspirationWidgetForm"

interface Props {
    mode: "Create" | "Update"
}

const InspirationWidgetPage = ({ mode }: Props) => {
    const { moduleId, widgetId } = useParams()

    const { data: module } = useInspirationModulesRetrieve(parseInt(moduleId!))
    const { data: widget, isRefetching } = useInspirationWidgetsRetrieve(parseInt(widgetId!), { query: { enabled: mode === "Update" } })

    if (mode === "Create" && !module) {
        return <Loader />
    } else if (mode === "Update" && (!widget || isRefetching)) {
        return <Loader />
    }

    return (
        <Page variant="configuration">
            <div>
                <InspirationWidgetForm mode={mode} module={module!} widget={widget} />
            </div>
        </Page>
    )
}

export default InspirationWidgetPage
