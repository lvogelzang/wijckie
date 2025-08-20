import { useCallback, type FC } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useInspirationOptionsCreate, useInspirationOptionsDestroy, useInspirationOptionsUpdate } from "../api/endpoints/api"
import { type InspirationModule, type InspirationOption, type TypeEnum } from "../api/models/api"
import ErrorMessage from "../components/ErrorMessage"
import RootFeedback from "../components/form/RootFeedback"
import SaveAndDelete from "../components/form/SaveAndDelete"
import { useErrorHandler } from "../helpers/useErrorHandler"
import useInspirationOptionTypeOptions from "../helpers/useInspirationOptionTypeOptions"

interface Props {
    mode: "Create" | "Update"
    module: InspirationModule
    option?: InspirationOption
}

interface Inputs {
    name: string
    type: TypeEnum
    text: string
}

const InspirationOptionForm: FC<Props> = ({ mode, module, option }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const typeOptions = useInspirationOptionTypeOptions()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationOptionsCreate()
    const update = useInspirationOptionsUpdate()
    const destroy = useInspirationOptionsDestroy()

    const {
        register,
        setError,
        formState: { errors },
        handleSubmit,
        watch,
    } = useForm<Inputs>({
        defaultValues: {
            name: mode === "Update" ? option!.name : "",
            type: mode === "Update" ? option!.type : "text",
            text: mode === "Update" ? option!.text : "",
        },
    })

    const navigateToParent = useCallback(() => {
        navigate(`/modules/inspiration/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name", "type", "text"])
        },
        [handleFormErrors, setError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name, type, text }) => {
            if (mode === "Create") {
                create.mutate({ data: { module: module.id, name, type, text } }, { onSuccess: navigateToParent, onError })
            } else if (mode === "Update") {
                update.mutate({ id: option!.id, data: { name, type, text } }, { onSuccess: navigateToParent, onError })
            }
        },
        [mode, update]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: option!.id }, { onSuccess, onError })
        })
    }, [destroy, option])

    const selectedType = watch("type")

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : option!.name}</h2>
            <Form.Group>
                <Form.Label>{t("Main.name")}</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>{t("Main.type")}</Form.Label>
                <Form.Select {...register("type")} isInvalid={!!errors.type} disabled={mode !== "Create"}>
                    {typeOptions.map(({ id, label }) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group hidden={selectedType !== "text"}>
                <Form.Label>{t("Main.text")}</Form.Label>
                <Form.Control type="text" {...register("text")} isInvalid={!!errors.text} />
                <Form.Control.Feedback type="invalid">
                    <ErrorMessage error={errors.text} />
                </Form.Control.Feedback>
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <RootFeedback errors={errors} />
        </Form>
    )
}

export default InspirationOptionForm
