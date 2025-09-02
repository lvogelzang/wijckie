import { useCallback } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDailyTodoOptionsCreate, useDailyTodoOptionsDestroy, useDailyTodoOptionsUpdate } from "../../../api/endpoints/api"
import { type DailyTodoOption, type DailyTodosModule, type TypeEnum } from "../../../api/models/api"
import ErrorMessage from "../../../components/ErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
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
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : option!.name}</h2>
            <Form.Group>
                <Form.Label>{t("Main.name")}</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">
                    <ErrorMessage error={errors.name} />
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t("Main.text")}</Form.Label>
                <Form.Control type="text" {...register("text")} isInvalid={!!errors.text} />
                <Form.Control.Feedback type="invalid">
                    <ErrorMessage error={errors.text} />
                </Form.Control.Feedback>
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
            <ErrorMessage error={errors.root} />
        </Form>
    )
}

export default DailyTodoOptionForm
