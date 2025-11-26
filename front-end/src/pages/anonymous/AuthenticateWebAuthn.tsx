import ErrorMessage from "@/components/error/error-message"
import { Page } from "@/components/Page"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import useLinkTree, { makeUrl } from "@/hooks/UseLinkTree"
import { get, parseRequestOptionsFromJSON, type AuthenticationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, useState } from "react"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getAllauthClientV1AuthWebauthnLogin, postAllauthClientV1AuthWebauthnLogin } from "../../api/endpoints/allauth"
import type { AuthenticatedResponse, WebAuthnCredential } from "../../api/models/allauth"
import { useErrorHandler, type ErrorMessageType } from "../../helpers/useErrorHandler"

const AuthenticateWebAuthn = () => {
    const { t } = useTranslation()
    const l = useLinkTree()
    const { resolveError } = useErrorHandler()
    const [error, setError] = useState<{ type: ErrorMessageType }>()

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            setError(resolveError(error))
        },
        [setError, resolveError]
    )

    const onClick = useCallback(() => {
        getAllauthClientV1AuthWebauthnLogin("browser")
            .then((optionsResponse) => {
                const options = parseRequestOptionsFromJSON(optionsResponse.data.request_options)
                get(options)
                    .then((credential: AuthenticationPublicKeyCredential) => {
                        postAllauthClientV1AuthWebauthnLogin("browser", { credential: credential as unknown as WebAuthnCredential })
                            .then(onSuccess)
                            .catch(onFailure)
                    })
                    .catch(onFailure)
            })
            .catch(onFailure)
    }, [onSuccess, onFailure])

    return (
        <Page variant="anonymous">
            <Card>
                <div className="m-auto flex flex-col items-center gap-6 text-center max-w-96">
                    <h1 className="text-xl font-bold">{t("AuthenticateWebAuthn.title")}</h1>
                    <p>{t("AuthenticateWebAuthn.body")}</p>
                    <Button type="button" onClick={onClick} data-cy="loginButton">
                        {t("WebAuthnLoginButton.title")}
                    </Button>
                    <ErrorMessage error={error} />
                    <p>
                        <Trans i18nKey="AuthenticateWebAuthn.no_passkey_yet">
                            No passkey on this device yet? Go to
                            <Link to={makeUrl(l.ACCOUNT_LOGIN_CODE, [])} data-cy="requestCode">
                                Request a sign-in code
                            </Link>
                            .
                        </Trans>
                    </p>
                    <p>
                        <Trans i18nKey="AuthenticateWebAuthn.no_account_yet">
                            No account yet? Go to the
                            <Link to={makeUrl(l.ACCOUNT_SIGNUP_PASSKEY, [])} data-cy="signUp">
                                Sign-up page
                            </Link>
                            .
                        </Trans>
                    </p>
                </div>
            </Card>
        </Page>
    )
}

export default AuthenticateWebAuthn
