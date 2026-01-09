import { useInspirationModulesRetrieve, useInspirationWidgetsRetrieve } from "@/api/endpoints/api"
import Loader from "@/components/Loader"
import { Page } from "@/components/Page"
import InspirationWidgetForm from "@/forms/modules/inspiration/InspirationWidgetForm"
import { useParams } from "react-router-dom"

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
            <InspirationWidgetForm mode={mode} module={module!} widget={widget} />
        </Page>
    )
}

export default InspirationWidgetPage
