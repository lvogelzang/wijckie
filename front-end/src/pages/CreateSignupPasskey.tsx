import { create, parseCreationOptionsFromJSON, type CredentialCreationOptionsJSON, type RegistrationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, useMemo, type FC } from "react"
import { Button, Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { getAllauthClientV1AuthWebauthnSignup, putAllauthClientV1AuthWebauthnSignup } from "../api/endpoints/allauth"
import type { AddWebAuthnAuthenticatorBody, AuthenticatedResponse, StatusOK } from "../api/models/allauth"
import ErrorMessage from "../components/ErrorMessage"
import { useErrorHandler } from "../helpers/useErrorHandler"
import { useYupValidationResolver } from "../helpers/useYupValidationResolver"

interface Inputs {
    name: string
}

const CreateSignupPasskey: FC = () => {
    const { t } = useTranslation()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            name: yup.string().required(),
        })
    }, [])

    const resolver = useYupValidationResolver(validationSchema)

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({ resolver, mode: "onSubmit", reValidateMode: "onSubmit" })

    const onSuccess = useCallback((response: AuthenticatedResponse) => {
        const event = new CustomEvent("allauth.auth.change", { detail: response })
        document.dispatchEvent(event)
    }, [])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name }) => {
            getAllauthClientV1AuthWebauthnSignup("browser")
                .then((optionsResponse) => {
                    const optionsResponseData = optionsResponse as unknown as {
                        data: { creation_options: CredentialCreationOptionsJSON }
                        status: StatusOK
                    }
                    const options = parseCreationOptionsFromJSON(optionsResponseData.data.creation_options)
                    create(options)
                        .then((credential: RegistrationPublicKeyCredential) => {
                            putAllauthClientV1AuthWebauthnSignup("browser", {
                                name,
                                credential: credential as unknown as AddWebAuthnAuthenticatorBody,
                            })
                                .then(onSuccess)
                                .catch(onFailure)
                        })
                        .catch(onFailure)
                })
                .catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("CreateSignupPasskey.title")}</h1>
            <Form noValidate onSubmit={handleSubmit(onSubmit)}>
                <Form.Group>
                    <Form.Label>{t("CreateSignupPasskey.passkey_name")}</Form.Label>
                    <Form.Control {...register("name")} isInvalid={!!errors.name} autoFocus />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.name} />
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Group>
                    <Button type="submit">{t("CreateSignupPasskey.submit_button")}</Button>
                </Form.Group>
                <Form.Group hidden={!errors.root}>
                    <Form.Control type="hidden" isInvalid={!!errors.root} />
                    <Form.Control.Feedback type="invalid">
                        <ErrorMessage error={errors.root} />
                    </Form.Control.Feedback>
                </Form.Group>
            </Form>
            <p>
                <Trans i18nKey="CreateSignupPasskey.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/login">Login</Link>.
                </Trans>
            </p>
        </div>
    )
}

export default CreateSignupPasskey
