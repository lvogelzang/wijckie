import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import { useMemo, type ReactNode } from "react"
import { Navigate } from "react-router-dom"
import type { AuthenticatorType, FlowId } from "./allauth"
import { useAuth } from "./useAuth"
import { useGetFlowDetails } from "./useGetFlowDetails"
import { useGetPathForFlow } from "./useGetPathForFlow"

interface Props {
    flowId?: FlowId
    authenticatorType?: AuthenticatorType
    children: ReactNode
}

const AnonymousRoute = ({ flowId, authenticatorType, children }: Props) => {
    const { isAuthenticated, pendingFlow } = useAuth()
    const l = useLinkTree()

    const getPathForFlow = useGetPathForFlow()
    const getFlowDetails = useGetFlowDetails()

    const pendingFlowDetails = useMemo(() => (pendingFlow ? getFlowDetails(pendingFlow) : undefined), [getFlowDetails, pendingFlow])
    const pendingFlowId = useMemo(() => pendingFlowDetails?.flowId, [pendingFlowDetails])
    const pendingFlowAuthenticatorId = useMemo(() => pendingFlowDetails?.authenticatorType, [pendingFlowDetails])

    if (isAuthenticated) {
        return <Navigate to={makeUrl(l.DASHBOARD, [])} />
    } else if (pendingFlowId && (pendingFlowId !== flowId || (pendingFlowAuthenticatorId && pendingFlowAuthenticatorId !== authenticatorType))) {
        return <Navigate to={getPathForFlow(pendingFlowId, pendingFlowAuthenticatorId)} />
    } else {
        return children
    }
}

export default AnonymousRoute
