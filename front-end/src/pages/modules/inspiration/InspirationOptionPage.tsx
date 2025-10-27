import { Page } from "@/components/Page"
import { useParams } from "react-router-dom"
import { useInspirationModulesRetrieve, useInspirationOptionsRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import InspirationOptionForm from "../../../forms/modules/inspiration/InspirationOptionForm"

interface Props {
    mode: "Create" | "Update"
}

const InspirationOptionPage = ({ mode }: Props) => {
    const { moduleId, optionId } = useParams()

    const { data: module } = useInspirationModulesRetrieve(parseInt(moduleId!))
    const { data: option, isRefetching } = useInspirationOptionsRetrieve(parseInt(optionId!), { query: { enabled: mode === "Update" } })

    if (mode === "Create" && !module) {
        return <Loader />
    } else if (mode === "Update" && (!option || isRefetching)) {
        return <Loader />
    }

    return (
        <Page variant="configuration">
            <div>
                <InspirationOptionForm mode={mode} module={module!} option={option} />
            </div>
        </Page>
    )
}

export default InspirationOptionPage
