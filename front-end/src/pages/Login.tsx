import { get, parseRequestOptionsFromJSON, type AuthenticationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { getAllauthClientV1AuthWebauthnLogin, postAllauthClientV1AuthWebauthnLogin } from "../api/endpoints/allauth"
import type { AuthenticatedResponse, WebAuthnCredential } from "../api/models/allauth"
import ErrorMessage from "../components/ErrorMessage"
import { useErrorHandler } from "../helpers/useErrorHandler"

/* eslint-disable */
interface Inputs {}
/* eslint-enable */

const Login: FC = () => {
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
            console.log(error)
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
            <h1>{t("LoginPage.title")}</h1>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Button type="submit">{t("WebAuthnLoginButton.title")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.root} />
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
            <p>
                <Trans i18nKey="LoginPage.no_account_yet">
                    No account yet?
                    <Link className="ms-1" to="/account/signup/passkey">
                        Sign up here.
                    </Link>
                </Trans>
            </p>
        </div>
    )
}

export default Login
