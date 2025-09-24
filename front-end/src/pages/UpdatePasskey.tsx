import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useLoaderData, useNavigate, useParams } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { deleteAllauthClientV1AccountAuthenticatorsWebauthn, putAllauthClientV1AccountAuthenticatorsWebauthn } from "../api/endpoints/allauth"
import type { AuthenticatorList } from "../api/models/allauth"
import { AuthenticatorTypes } from "../auth/allauth"
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

const UpdatePasskey: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { id } = useParams()
    const { handleFormErrors } = useErrorHandler()
    const authenticators = useLoaderData<AuthenticatorList>()
    const passkey = useMemo(() => authenticators.filter((a) => a.type === AuthenticatorTypes.WEBAUTHN).find((a) => a.id === parseInt(id!))!, [authenticators, id])

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
    } = useForm<Inputs>({ resolver, defaultValues: { name: passkey.name }, mode: "onSubmit", reValidateMode: "onSubmit" })

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
            putAllauthClientV1AccountAuthenticatorsWebauthn("browser", { id: passkey.id, name }).then(onSuccess).catch(onFailure)
        },
        [passkey, onSuccess, onFailure]
    )

    const onDelete = useCallback(() => {
        deleteAllauthClientV1AccountAuthenticatorsWebauthn("browser", {
            authenticators: [passkey.id],
        })
            .then(onSuccess)
            .catch(onFailure)
    }, [passkey, onSuccess, onFailure])

    return (
        <div>
            <h1>{t("UpdatePasskey.title")}</h1>
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("UpdatePasskey.name")}</WLabel>
                    <WInput type="text" {...register("name")} invalid={!!errors.name} />
                    <WErrorMessage error={errors.name} />
                </WField>
                <WField>
                    <WButton type="submit">{t("UpdatePasskey.submit_button")}</WButton>
                    <WButton type="button" variant="danger" onClick={onDelete}>
                        {t("UpdatePasskey.delete_button")}
                    </WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
        </div>
    )
}

export default UpdatePasskey
