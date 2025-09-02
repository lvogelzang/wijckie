import { useCallback } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useDailyTodosWidgetsCreate, useDailyTodosWidgetsDestroy, useDailyTodosWidgetsUpdate } from "../../../api/endpoints/api"
import type { DailyTodosModule, DailyTodosWidget } from "../../../api/models/api"
import ErrorMessage from "../../../components/ErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
import { useErrorHandler } from "../../../helpers/useErrorHandler"

interface Props {
    mode: "Create" | "Update"
    module: DailyTodosModule
    widget?: DailyTodosWidget
}

interface Inputs {
    name: string
}

const DailyTodosWidgetForm = ({ mode, module, widget }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const { handleFormErrors } = useErrorHandler()
    const create = useDailyTodosWidgetsCreate()
    const update = useDailyTodosWidgetsUpdate()
    const destroy = useDailyTodosWidgetsDestroy()

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
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : widget!.name}</h2>
            <Form.Group>
                <Form.Label>{t("Main.name")}</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">
                    <ErrorMessage error={errors.name} />
                </Form.Control.Feedback>
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${widget?.name}`} onDelete={onDelete} onDeleted={onSuccess} />
            <ErrorMessage error={errors.root} />
        </Form>
    )
}

export default DailyTodosWidgetForm
