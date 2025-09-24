import { useCallback } from "react"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDailyTodoOptionsCreate, useDailyTodoOptionsDestroy, useDailyTodoOptionsUpdate } from "../../../api/endpoints/api"
import { type DailyTodoOption, type DailyTodosModule, type TypeEnum } from "../../../api/models/api"
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
    module: DailyTodosModule
    option?: DailyTodoOption
}

interface Inputs {
    name: string
    type: TypeEnum
    text: string
    image: FileList
}

const DailyTodoOptionForm = ({ mode, module, option }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useDailyTodoOptionsCreate()
    const update = useDailyTodoOptionsUpdate()
    const destroy = useDailyTodoOptionsDestroy()

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({
        defaultValues: {
            name: mode === "Update" ? option!.name : "",
            text: mode === "Update" ? option!.text : "",
        },
    })

    const onSuccess = useCallback(() => {
        navigate(`/modules/daily-todos/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name", "text"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name, text }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                            text,
                        },
                    },
                    {
                        onSuccess,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: option!.id, data: { name, text } },
                    {
                        onSuccess,
                        onError,
                    }
                )
            }
        },
        [mode, module, option, create, update, onSuccess, onError]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: option!.id }, { onSuccess, onError })
        })
    }, [destroy, option])

    return (
        <WForm onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : option!.name}</h2>
            <WField>
                <WLabel>{t("Main.name")}</WLabel>
                <WInput type="text" {...register("name")} invalid={!!errors.name} />
                <WErrorMessage error={errors.name} />
            </WField>
            <WField>
                <WLabel>{t("Main.text")}</WLabel>
                <WInput type="text" {...register("text")} invalid={!!errors.text} />
                <WErrorMessage error={errors.text} />
            </WField>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
            <RootErrorMessage errors={errors} />
        </WForm>
    )
}

export default DailyTodoOptionForm
