import { useCallback } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
    useInspirationOptionsCreate,
    useInspirationOptionsDestroy,
    useInspirationOptionsPartialUpdate,
    useInspirationOptionsUpdate,
    type InspirationOptionsCreateMutationResult,
    type InspirationOptionsUpdateMutationResult,
} from "../../../api/endpoints/api"
import type { FileUpload, InspirationModule, InspirationOption, TypeEnum } from "../../../api/models/api"
import ErrorMessage from "../../../components/ErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
import { handleUpload } from "../../../helpers/uploadHelper"
import { useErrorHandler } from "../../../helpers/useErrorHandler"
import useInspirationOptionTypeOptions from "../../../helpers/useInspirationOptionTypeOptions"

interface Props {
    mode: "Create" | "Update"
    module: InspirationModule
    option?: InspirationOption
}

interface Inputs {
    name: string
    type: TypeEnum
    text: string
    image: FileList
}

const InspirationOptionForm = ({ mode, module, option }: Props) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const typeOptions = useInspirationOptionTypeOptions()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationOptionsCreate()
    const update = useInspirationOptionsUpdate()
    const partialUpdate = useInspirationOptionsPartialUpdate()
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

    const selectedType = watch("type")

    const navigateToParent = useCallback(() => {
        navigate(`/modules/inspiration/${module.id}`)
    }, [navigate, module])

    const onError = useCallback(
        (error: unknown) => {
            handleFormErrors(setError, error, ["name", "type", "text", "image"])
        },
        [handleFormErrors, setError]
    )

    const attachFileUploadToOption = useCallback(
        (fileUpload: FileUpload, inspirationOption: InspirationOptionsCreateMutationResult | InspirationOptionsUpdateMutationResult) => {
            partialUpdate.mutate({ id: inspirationOption.id, data: { image: fileUpload.id } }, { onSuccess: navigateToParent, onError })
        },
        [partialUpdate, navigateToParent, onError]
    )

    const onSubmit: SubmitHandler<Inputs> = useCallback(
        ({ name, type, text, image }) => {
            if (mode === "Create") {
                create.mutate(
                    {
                        data: {
                            module: module.id,
                            name,
                            type,
                            text: type === "text" ? text : undefined,
                        },
                    },
                    {
                        onSuccess:
                            image.length > 0
                                ? (inspirationOption: InspirationOptionsCreateMutationResult) => handleUpload(inspirationOption, "image", image, attachFileUploadToOption, onError)
                                : navigateToParent,
                        onError,
                    }
                )
            } else if (mode === "Update") {
                update.mutate(
                    { id: option!.id, data: { name, type, text: type === "text" ? text : undefined } },
                    {
                        onSuccess:
                            image.length > 0
                                ? (inspirationOption: InspirationOptionsUpdateMutationResult) => handleUpload(inspirationOption, "image", image, attachFileUploadToOption, onError)
                                : navigateToParent,
                        onError,
                    }
                )
            }
        },
        [mode, module, option, create, update, navigateToParent, onError]
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
            <Form.Group hidden={selectedType !== "image"}>
                <Form.Label>{t("Main.image")}</Form.Label>
                <Form.Control type="file" hidden={true} />
                <div hidden={!option?.imageURL}>
                    <img src={option?.imageURL} style={{ height: "20rem", maxWidth: "100rem" }} />
                </div>
                <Form.Control type="file" {...register("image")} isInvalid={!!errors.image} />
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <ErrorMessage error={errors.root} />
        </Form>
    )
}

export default InspirationOptionForm
