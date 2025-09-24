import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useInspirationModulesCreate, useInspirationModulesDestroy, useInspirationModulesUpdate } from "../../../api/endpoints/api"
import type { InspirationModule } from "../../../api/models/api"
import RootErrorMessage from "../../../components/form/RootErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
import WErrorMessage from "../../../components/form/WErrorMessage"
import WField from "../../../components/form/WField"
import WForm from "../../../components/form/WForm"
import WInput from "../../../components/form/WInput"
import WLabel from "../../../components/form/WLabel"
import { useErrorHandler } from "../../../helpers/useErrorHandler"

interface Props {
    mode: "Create" | "Update"
    module?: InspirationModule
}

interface Inputs {
    name: string
}

const InspirationModuleForm = ({ mode, module }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationModulesCreate()
    const update = useInspirationModulesUpdate()
    const destroy = useInspirationModulesDestroy()

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({ defaultValues: { name: mode === "Update" ? module!.name : "" } })

    const navigateToObject = useCallback(
        (object: InspirationModule) => {
            navigate(`/modules/inspiration/${object.id}`)
        },
        [navigate]
    )

    const navigateToParent = useCallback(() => {
        navigate("/modules")
    }, [navigate])

    const onSuccess = useCallback(
        (object: InspirationModule) => {
            if (mode === "Create") {
                navigateToObject(object)
            } else if (mode === "Update") {
                navigateToParent()
            }
        },
        [mode, navigateToObject, navigateToParent]
    )

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name }) => {
            if (mode === "Create") {
                create.mutate({ data: { name } }, { onSuccess, onError })
            } else if (mode === "Update") {
                update.mutate({ id: module!.id, data: { name } }, { onSuccess, onError })
            }
        },
        [mode, create, update, module, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: module!.id }, { onSuccess, onError })
        })
    }, [destroy, module])

    return (
        <WForm onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : module!.name}</h2>
            <WField>
                <WLabel>{t("Main.name")}</WLabel>
                <WInput type="text" {...register("name")} invalid={!!errors.name} />
                <WErrorMessage error={errors.name} />
            </WField>
            <SaveAndDelete mode={mode} name={`${module?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <RootErrorMessage errors={errors} />
        </WForm>
    )
}

export default InspirationModuleForm
