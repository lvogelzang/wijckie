import { get, parseRequestOptionsFromJSON, type AuthenticationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, type FC } from "react"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getAllauthClientV1AuthWebauthnLogin, postAllauthClientV1AuthWebauthnLogin } from "../api/endpoints/allauth"
import type { AuthenticatedResponse, WebAuthnCredential } from "../api/models/allauth"
import WButton from "../components/button/WButton"
import RootErrorMessage from "../components/form/RootErrorMessage"
import WField from "../components/form/WField"
import WForm from "../components/form/WForm"
import { useErrorHandler } from "../helpers/useErrorHandler"

/* eslint-disable */
interface Inputs {}
/* eslint-enable */

const AuthenticateWebAuthn: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()

    const {
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>()

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

    const onSubmit = useCallback(() => {
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
        <div>
            <h1>{t("AuthenticateWebAuthn.title")}</h1>
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WButton type="submit">{t("WebAuthnLoginButton.title")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
            <p>
                <Trans i18nKey="AuthenticateWebAuthn.no_passkey_yet">
                    No passkey on this device yet? Go to
                    <Link to="/account/login/code" data-cy="requestCode">
                        Request a sign-in code
                    </Link>
                    .
                </Trans>
            </p>
            <p>
                <Trans i18nKey="AuthenticateWebAuthn.no_account_yet">
                    No account yet? Go to the
                    <Link to="/account/signup/passkey" data-cy="signUp">
                        Sign-up page
                    </Link>
                    .
                </Trans>
            </p>
        </div>
    )
}

export default AuthenticateWebAuthn
