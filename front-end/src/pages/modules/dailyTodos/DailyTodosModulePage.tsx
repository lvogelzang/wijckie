import { useParams } from "react-router-dom"
import { useDailyTodosModulesRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import DailyTodosModuleForm from "../../../forms/DailyTodosModuleForm"
import DailyTodoOptionTable from "../../../tables/DailyTodoOptionTable"

interface Props {
    mode: "Create" | "Update"
}

const DailyTodosModulePage = ({ mode }: Props) => {
    const { moduleId } = useParams()

    const { data: module, isRefetching } = useDailyTodosModulesRetrieve(parseInt(moduleId!), { query: { enabled: mode === "Update" } })

    if (mode === "Update" && (!module || isRefetching)) {
        return <Loader />
    }

    return (
        <div>
            <DailyTodosModuleForm mode={mode} module={module} />
            {mode === "Update" ? <DailyTodoOptionTable module={module!} /> : null}
        </div>
    )
}

export default DailyTodosModulePage
