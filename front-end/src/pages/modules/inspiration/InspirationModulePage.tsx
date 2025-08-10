import type { FC } from "react"
import { useParams } from "react-router-dom"
import { useInspirationModulesRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import InspirationModuleForm from "../../../forms/InspirationModuleForm"

interface Props {
    mode: "Create" | "Update"
}

const InspirationModulePage: FC<Props> = ({ mode }) => {
    const { id } = useParams()

    const { data: inspirationModule, isRefetching } = useInspirationModulesRetrieve(id!, { query: { enabled: mode === "Update" } })

    if (mode === "Update" && (!inspirationModule || isRefetching)) {
        return <Loader />
    }

    return (
        <div>
            <InspirationModuleForm mode={mode} inspirationModule={inspirationModule} />
        </div>
    )
}

export default InspirationModulePage
