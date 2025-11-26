import { useDailyTodoOptionsRetrieve, useDailyTodosModulesRetrieve } from "@/api/endpoints/api"
import Loader from "@/components/Loader"
import { Page } from "@/components/Page"
import DailyTodoOptionForm from "@/forms/modules/dailyTodos/DailyTodoOptionForm"
import { useParams } from "react-router-dom"

interface Props {
    mode: "Create" | "Update"
}

const DailyTodoOptionPage = ({ mode }: Props) => {
    const { moduleId, optionId } = useParams()

    const { data: module } = useDailyTodosModulesRetrieve(parseInt(moduleId!))
    const { data: option, isRefetching } = useDailyTodoOptionsRetrieve(parseInt(optionId!), { query: { enabled: mode === "Update" } })

    if (mode === "Create" && !module) {
        return <Loader />
    } else if (mode === "Update" && (!option || isRefetching)) {
        return <Loader />
    }

    return (
        <Page variant="configuration">
            <div>
                <DailyTodoOptionForm mode={mode} module={module!} option={option} />
            </div>
        </Page>
    )
}

export default DailyTodoOptionPage
