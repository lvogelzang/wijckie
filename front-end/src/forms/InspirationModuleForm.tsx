import { useCallback, type FC } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { useInspirationModulesCreate, useInspirationModulesDestroy, useInspirationModulesUpdate } from "../api/endpoints/api"
import type { InspirationModule } from "../api/models/api"
import RootFeedback from "../components/form/RootFeedback"
import SaveAndDelete from "../components/form/SaveAndDelete"
import { useErrorHandler } from "../helpers/useErrorHandler"

interface Props {
    mode: "Create" | "Update"
    inspirationModule?: InspirationModule
}

interface Inputs {
    name: string
}

const InspirationModuleForm: FC<Props> = ({ mode, inspirationModule }) => {
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
    } = useForm<Inputs>({ defaultValues: { name: mode === "Update" ? inspirationModule!.name : "" } })

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
        [navigateToParent]
    )

    const onError = useCallback((error: unknown) => {
        handleFormErrors(setError, error, ["name"])
    }, [])

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name }) => {
            if (mode === "Create") {
                create.mutate({ data: { name } }, { onSuccess, onError })
            } else if (mode === "Update") {
                update.mutate({ id: inspirationModule!.id.toString(), data: { name } }, { onSuccess, onError })
            }
        },
        [mode, update]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: inspirationModule!.id.toString() }, { onSuccess, onError })
        })
    }, [destroy, inspirationModule])

    return (
        <Form noValidate onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? "NEW" : inspirationModule!.name}</h2>
            <Form.Group>
                <Form.Label>{t("Main.name")}</Form.Label>
                <Form.Control type="text" {...register("name")} isInvalid={!!errors.name} />
                <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${inspirationModule?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <RootFeedback errors={errors} />
        </Form>
    )
}

export default InspirationModuleForm
