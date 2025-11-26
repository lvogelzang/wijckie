import { makeUrl } from "@/helpers/LinkTreeHelper"
import useLinkTree from "@/hooks/UseLinkTree"
import { useCallback, useMemo } from "react"
import { AuthenticatorTypes, Flows, type AuthenticatorType, type FlowId } from "./allauth"

export const useGetPathForFlow = () => {
    const l = useLinkTree()

    const flowMap = useMemo(() => {
        const map = new Map<string, string>()
        map.set(Flows.LOGIN_BY_CODE, makeUrl(l.ACCOUNT_LOGIN_CODE_CONFIRM, []))
        map.set(Flows.VERIFY_EMAIL, makeUrl(l.ACCOUNT_VERIFY_EMAIL, []))
        map.set(`${Flows.MFA_AUTHENTICATE}:${AuthenticatorTypes.WEBAUTHN}`, makeUrl(l.ACCOUNT_LOGIN_WEBAUTHN, []))
        map.set(Flows.MFA_WEBAUTHN_SIGNUP, makeUrl(l.ACCOUNT_SIGNUP_PASSKEY_CREATE, []))

        return map
    }, [l])

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
