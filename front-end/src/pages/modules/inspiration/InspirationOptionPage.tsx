import type { FC } from "react"
import { useParams } from "react-router-dom"
import { useInspirationModulesRetrieve, useInspirationOptionsRetrieve } from "../../../api/endpoints/api"
import Loader from "../../../components/Loader"
import InspirationOptionForm from "../../../forms/InspirationOptionForm"

interface Props {
    mode: "Create" | "Update"
}

const InspirationOptionPage: FC<Props> = ({ mode }) => {
    const { moduleId, optionId } = useParams()

    const { data: module } = useInspirationModulesRetrieve(parseInt(moduleId!))
    const { data: option, isRefetching } = useInspirationOptionsRetrieve(parseInt(optionId!), { query: { enabled: mode === "Update" } })

    if (mode === "Create" && !module) {
        return <Loader />
    } else if (mode === "Update" && (!option || isRefetching)) {
        return <Loader />
    }

    return (
        <div>
            <InspirationOptionForm mode={mode} module={module!} option={option} />
        </div>
    )
}

export default InspirationOptionPage
