import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useInspirationWidgetsCreate, useInspirationWidgetsDestroy, useInspirationWidgetsUpdate } from "../../../api/endpoints/api"
import type { InspirationModule, InspirationWidget } from "../../../api/models/api"
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
    module: InspirationModule
    widget?: InspirationWidget
}

interface Inputs {
    name: string
}

const InspirationWidgetForm = ({ mode, module, widget }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationWidgetsCreate()
    const update = useInspirationWidgetsUpdate()
    const destroy = useInspirationWidgetsDestroy()

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({
        defaultValues: {
            name: mode === "Update" ? widget!.name : "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(`/modules/daily-todos/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                        },
                    },
                    {
                        onSuccess,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: widget!.id, data: { name } },
                    {
                        onSuccess,
                        onError,
                    }
                )
            }
        },
        [mode, module, widget, create, update, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: widget!.id }, { onSuccess, onError })
        })
    }, [destroy, widget])

    return (
        <WForm onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : widget!.name}</h2>
            <WField>
                <WLabel>{t("Main.name")}</WLabel>
                <WInput type="text" {...register("name")} invalid={!!errors.name} />
                <WErrorMessage error={errors.name} />
            </WField>
            <SaveAndDelete mode={mode} name={`${widget?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
            <RootErrorMessage errors={errors} />
        </WForm>
    )
}

export default InspirationWidgetForm
