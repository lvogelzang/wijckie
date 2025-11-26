import { Page } from "@/components/Page"
import { useParams } from "react-router-dom"
import { useDailyTodosModulesRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import DailyTodosModuleForm from "../../../forms/modules/dailyTodos/DailyTodosModuleForm"
import DailyTodoOptionTable from "../../../tables/modules/dailyTodos/DailyTodoOptionTable"
import DailyTodoWidgetTable from "../../../tables/modules/dailyTodos/DailyTodoWidgetTable"

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
        <Page variant="configuration">
            <div>
                <DailyTodosModuleForm mode={mode} module={module} />
                {mode === "Update" ? <DailyTodoOptionTable titleStyle="Section" module={module!} /> : null}
                {mode === "Update" ? <DailyTodoWidgetTable titleStyle="Section" module={module!} /> : null}
            </div>
        </Page>
    )
}

export default DailyTodosModulePage
