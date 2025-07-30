import { useCallback } from "react"
import type { Flow } from "../api/models/allauth"
import type { AuthenticatorType, FlowId } from "./allauth"

const getAuthenticatorType = (flow: Flow) => {
    if ("types" in flow && Array.isArray(flow.types)) {
        if (flow.types.length > 0 && typeof flow.types[0] === "string") {
            return flow.types[0] as AuthenticatorType
        }
    }
}

export const useGetFlowDetails = () => {
    return useCallback((flow: Flow) => {
        const flowId = flow.id as FlowId
        const authenticatorType = getAuthenticatorType(flow)
        return { flowId, authenticatorType }
    }, [])
}
