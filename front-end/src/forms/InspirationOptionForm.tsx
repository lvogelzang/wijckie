import { useCallback, useState, type FC } from "react"
import { Form } from "react-bootstrap"
import { useForm, type SubmitHandler } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import {
    fileUploadsCreate,
    useInspirationOptionsCreate,
    useInspirationOptionsDestroy,
    useInspirationOptionsPartialUpdate,
    useInspirationOptionsUpdate,
    type InspirationOptionsCreateMutationResult,
} from "../api/endpoints/api"
import { type InspirationModule, type InspirationOption, type TypeEnum } from "../api/models/api"
import ErrorMessage from "../components/ErrorMessage"
import SaveAndDelete from "../components/form/SaveAndDelete"
import UploadHandler from "../components/upload/UploadHandler"
import { UPLOAD_SIZE_LIMIT } from "../helpers/constants"
import { useErrorHandler } from "../helpers/useErrorHandler"
import useInspirationOptionTypeOptions from "../helpers/useInspirationOptionTypeOptions"
import type { UploadJob } from "../types/UploadJob"

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

const InspirationOptionForm: FC<Props> = ({ mode, module, option }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()
    const typeOptions = useInspirationOptionTypeOptions()
    const { handleFormErrors } = useErrorHandler()
    const create = useInspirationOptionsCreate()
    const update = useInspirationOptionsUpdate()
    const partialUpdate = useInspirationOptionsPartialUpdate()
    const destroy = useInspirationOptionsDestroy()

    const [uploadJob, setUploadJob] = useState<UploadJob<InspirationOption>>()

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

    const imageFile = watch("image")

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

    const startUpload = useCallback(
        (object: InspirationOptionsCreateMutationResult) => {
            const file = imageFile.item(0)!
            if (file.size > UPLOAD_SIZE_LIMIT) {
                onError({ manualErrors: [{ field: "image", code: "too_big" }] })
            } else {
                fileUploadsCreate({ fileName: file.name })
                    .then((response) => setUploadJob({ fileUpload: response, target: object }))
                    .catch(onError)
            }
        },
        [onError, setUploadJob, imageFile]
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
                    { onSuccess: image.length > 0 ? startUpload : navigateToParent, onError }
                )
            } else if (mode === "Update") {
                update.mutate({ id: option!.id, data: { name, type, text } }, { onSuccess: image.length > 0 ? startUpload : navigateToParent, onError })
            }
        },
        [mode, option, create, update, startUpload, navigateToParent]
    )

    const onDelete = useCallback(() => {
        return new Promise((onSuccess, onError) => {
            destroy.mutate({ id: option!.id }, { onSuccess, onError })
        })
    }, [destroy, option])

    const attachFileUploadToOption = useCallback(
        (uploadJob: UploadJob<InspirationOption>) => {
            partialUpdate.mutate({ id: uploadJob.target.id, data: { image: uploadJob.fileUpload.id } }, { onSuccess: navigateToParent, onError })
        },
        [partialUpdate, option, navigateToParent, onError]
    )

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
                <div>
                    <img src={option?.imageURL} style={{ width: "10rem", height: "10rem" }} />
                </div>
                <Form.Control type="file" {...register("image")} isInvalid={!!errors.image} />
            </Form.Group>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <UploadHandler uploadJob={uploadJob} file={imageFile} onSuccess={attachFileUploadToOption} />
            <ErrorMessage error={errors.root} />
        </Form>
    )
}

export default InspirationOptionForm
