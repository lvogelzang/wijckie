import { useParams } from "react-router-dom"
import { useInspirationModulesRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import InspirationModuleForm from "../../../forms/InspirationModuleForm"
import InspirationOptionTable from "../../../tables/InspirationOptionTable"

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
        <div>
            <InspirationModuleForm mode={mode} module={module} />
            {mode === "Update" ? <InspirationOptionTable module={module!} /> : null}
        </div>
    )
}

export default InspirationModulePage
