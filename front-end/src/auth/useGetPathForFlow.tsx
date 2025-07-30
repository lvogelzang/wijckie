import { useCallback, useMemo } from "react"
import { AuthenticatorTypes, Flows, type AuthenticatorType, type FlowId } from "./allauth"

export const useGetPathForFlow = () => {
    const flowMap = useMemo(() => {
        const map = new Map<string, string>()
        map.set(Flows.LOGIN_BY_CODE, "/account/login/code/confirm")
        map.set(Flows.VERIFY_EMAIL, "/account/verify-email")
        map.set(`${Flows.MFA_AUTHENTICATE}:${AuthenticatorTypes.WEBAUTHN}`, "/account/authenticate/webauthn")
        map.set(`${Flows.MFA_REAUTHENTICATE}:${AuthenticatorTypes.WEBAUTHN}`, "/account/reauthenticate/webauthn")
        map.set(Flows.MFA_WEBAUTHN_SIGNUP, "/account/signup/passkey/create")

        return map
    }, [])

    return useCallback(
        (flowId: FlowId, authenticatorType?: AuthenticatorType) => {
            if (authenticatorType) {
                return flowMap.get(`${flowId}:${authenticatorType}`)!
            }
            return flowMap.get(flowId)!
        },
        [flowMap]
    )
}
