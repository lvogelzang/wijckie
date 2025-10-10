import { InlineErrorMessage } from "@/components/error/inline-error-message"
import { Button } from "@/components/ui/button"
import { get, parseRequestOptionsFromJSON, type AuthenticationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, useState, type FC } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getAllauthClientV1AuthWebauthnReauthenticate, postAllauthClientV1AuthWebauthnReauthenticate } from "../api/endpoints/allauth"
import type { AuthenticatedResponse, WebAuthnCredential } from "../api/models/allauth"
import { useErrorHandler } from "../helpers/useErrorHandler"

const ReauthenticateWebAuthn: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()
    const [error, setError] = useState<string>()

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, [])
        },
        [handleFormErrors, setError]
    )

    const onClick = useCallback(() => {
        getAllauthClientV1AuthWebauthnReauthenticate("browser")
            .then((optionsResponse) => {
                const options = parseRequestOptionsFromJSON(optionsResponse.data.request_options)
                get(options)
                    .then((credential: AuthenticationPublicKeyCredential) => {
                        postAllauthClientV1AuthWebauthnReauthenticate("browser", { credential: credential as unknown as WebAuthnCredential })
                            .then(onSuccess)
                            .catch(onFailure)
                    })
                    .catch(onFailure)
            })
            .catch(onFailure)
    }, [onSuccess, onFailure])

    return (
        <div>
            <h1>{t("ReauthenticateWebAuthn.title")}</h1>
            <Button type="button" onClick={onClick}>
                {t("WebAuthnLoginButton.title")}
            </Button>
            <InlineErrorMessage hidden={!error}>{error}</InlineErrorMessage>
            <p>
                <Trans i18nKey="LoginPage.no_passkey_yet">
                    No passkey on this device yet? Go to
                    <Link to="/account/login/code">Request a sign-in code</Link>.
                </Trans>
            </p>
        </div>
    )
}

export default ReauthenticateWebAuthn
