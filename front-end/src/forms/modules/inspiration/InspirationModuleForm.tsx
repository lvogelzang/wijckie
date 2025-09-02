import { useCallback } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useInspirationModulesCreate, useInspirationModulesDestroy, useInspirationModulesUpdate } from "../../../api/endpoints/api"
import type { InspirationModule } from "../../../api/models/api"
import ErrorMessage from "../../../components/ErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
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
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : module!.name}</h2>
            <Form.Group>
                <Form.Label>{t("Main.name")}</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">
                    <ErrorMessage error={errors.name} />
                </Form.Control.Feedback>
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${module?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <ErrorMessage error={errors.root} />
        </Form>
    )
}

export default InspirationModuleForm
