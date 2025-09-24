import { useCallback, useMemo, type FC } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import type { ObjectSchema } from "yup"
import * as yup from "yup"
import { postAllauthClientV1AccountEmail } from "../api/endpoints/allauth"
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
    email: string
}

const AddEmailAddress: FC = () => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()

    const validationSchema: ObjectSchema<Inputs> = useMemo(() => {
        return yup.object({
            email: yup.string().email().required(),
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
        navigate("/account/verify-email")
    }, [navigate])

    const onFailure = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["email"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ email }) => {
            postAllauthClientV1AccountEmail("browser", { email }).then(onSuccess).catch(onFailure)
        },
        [onSuccess, onFailure]
    )

    return (
        <div>
            <h1>{t("AddEmailAddress.title")}</h1>
            <WForm onSubmit={handleSubmit(onSubmit)}>
                <WField>
                    <WLabel>{t("AddEmailAddress.email")}</WLabel>
                    <WInput type="email" {...register("email")} invalid={!!errors.email} data-cy="emailInput" />
                    <WErrorMessage error={errors.email} />
                </WField>
                <WField>
                    <WButton type="submit">{t("AddEmailAddress.submit_button")}</WButton>
                </WField>
                <RootErrorMessage errors={errors} />
            </WForm>
        </div>
    )
}

export default AddEmailAddress
