import { useInspirationModulesRetrieve } from "@/api/endpoints/api"
import Loader from "@/components/Loader"
import { Page } from "@/components/Page"
import InspirationModuleForm from "@/forms/modules/inspiration/InspirationModuleForm"
import InspirationOptionTable from "@/tables/modules/inspiration/InspirationOptionTable"
import InspirationWidgetTable from "@/tables/modules/inspiration/InspirationWidgetTable"
import { useParams } from "react-router-dom"

interface Props {
    mode: "Create" | "Update"
}

const InspirationModulePage = ({ mode }: Props) => {
    const { moduleId } = useParams()

    const { data: module, isRefetching } = useInspirationModulesRetrieve(parseInt(moduleId!), { query: { enabled: mode === "Update" } })

    if (mode === "Update" && (!module || isRefetching)) {
        return <Loader />
    }

    return (
        <Page variant="configuration">
            <InspirationModuleForm mode={mode} module={module} />
            {mode === "Update" ? <InspirationOptionTable titleStyle="Section" module={module!} /> : null}
            {mode === "Update" ? <InspirationWidgetTable titleStyle="Section" module={module!} /> : null}
        </Page>
    )
}

export default InspirationModulePage
