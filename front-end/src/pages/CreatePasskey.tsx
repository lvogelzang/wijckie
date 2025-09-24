import { create, parseCreationOptionsFromJSON, type CredentialCreationOptionsJSON, type RegistrationPublicKeyCredential } from "@github/webauthn-json/browser-ponyfill"
import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { getAllauthClientV1AccountAuthenticatorsWebauthn, postAllauthClientV1AccountAuthenticatorsWebauthn } from "../api/endpoints/allauth"
import type { AddWebAuthnAuthenticatorBody, StatusOK } from "../api/models/allauth"
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

const CreatePasskey: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            name: yup.string().required(),
        })
    }, [])

    const resolver = useYupValidationResolver(validationSchema)

    const {
        formState: { errors },
        handleSubmit,
        register,
        setError,
    } = useForm<Inputs>({ resolver, mode: "onSubmit", reValidateMode: "onSubmit" })

    const onSuccess = useCallback(() => {
        navigate("/account/my")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name }) => {
            getAllauthClientV1AccountAuthenticatorsWebauthn("browser")
                .then((optionsResponse) => {
                    const optionsResponseData = optionsResponse as unknown as {
                        data: { creation_options: CredentialCreationOptionsJSON }
                        status: StatusOK
                    }
                    const options = parseCreationOptionsFromJSON(optionsResponseData.data.creation_options)
                    create(options)
                        .then((credential: RegistrationPublicKeyCredential) => {
                            postAllauthClientV1AccountAuthenticatorsWebauthn("browser", {
                                credential: credential as unknown as AddWebAuthnAuthenticatorBody,
                                name,
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
            <h1>{t("CreatePasskey.title")}</h1>
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("UpdatePasskey.name")}</WLabel>
                    <WInput type="text" {...register("name")} invalid={!!errors.name} data-cy="nameInput" />
                    <WErrorMessage error={errors.name} />
                </WField>
                <WField>
                    <WButton type="submit">{t("CreatePasskey.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
        </div>
    )
}

export default CreatePasskey
