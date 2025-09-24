import { create, parseCreationOptionsFromJSON, type CredentialCreationOptionsJSON, type RegistrationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { Trans, useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { getAllauthClientV1AuthWebauthnSignup, putAllauthClientV1AuthWebauthnSignup } from "../api/endpoints/allauth"
import type { AddWebAuthnAuthenticatorBody, AuthenticatedResponse, StatusOK } from "../api/models/allauth"
import WButton from "../components/button/WButton"
import RootErrorMessage from "../components/form/RootErrorMessage"
import WErrorMessage from "../components/form/WErrorMessage"
import WField from "../components/form/WField"
import WForm from "../components/form/WForm"
import WInput from "../components/form/WInput"
import WLabel from "../components/form/WLabel"
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
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("CreateSignupPasskey.passkey_name")}</WLabel>
                    <WInput type="text" {...register("name")} invalid={!!errors.name} autoFocus data-cy="nameInput" />
                    <WErrorMessage error={errors.name} />
                </WField>
                <WField>
                    <WButton type="submit">{t("CreateSignupPasskey.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
            <p>
                <Trans i18nKey="CreateSignupPasskey.already_an_account">
                    Already have an account? Go to
                    <Link to="/account/authenticate/webauthn">Login</Link>.
                </Trans>
            </p>
        </div>
    )
}

export default CreateSignupPasskey
