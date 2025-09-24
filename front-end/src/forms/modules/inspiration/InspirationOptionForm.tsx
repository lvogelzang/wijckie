import { useCallback } from "react"
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
import RootErrorMessage from "../../../components/form/RootErrorMessage"
import SaveAndDelete from "../../../components/form/SaveAndDelete"
import WErrorMessage from "../../../components/form/WErrorMessage"
import WField from "../../../components/form/WField"
import WForm from "../../../components/form/WForm"
import WInput from "../../../components/form/WInput"
import WLabel from "../../../components/form/WLabel"
import WSelect from "../../../components/form/WSelect"
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
        <WForm onSubmit={handleSubmit(onSubmit)}>
            <h2>{mode === "Create" ? t("Main.title_new") : option!.name}</h2>
            <WField>
                <WLabel>{t("Main.name")}</WLabel>
                <WInput type="text" {...register("name")} invalid={!!errors.name} />
                <WErrorMessage error={errors.name} />
            </WField>
            <WField>
                <WLabel>{t("Main.type")}</WLabel>
                <WSelect label={t("Main.type")} {...register("type")} invalid={!!errors.type} disabled={mode !== "Create"}>
                    {typeOptions.map(({ id, label }) => (
                        <option key={id} value={id}>
                            {label}
                        </option>
                    ))}
                </WSelect>
                <WErrorMessage error={errors.type} />
            </WField>
            <WField hidden={selectedType !== "text"}>
                <WLabel>{t("Main.text")}</WLabel>
                <WInput type="text" {...register("text")} invalid={!!errors.text} />
                <WErrorMessage error={errors.text} />
            </WField>
            <WField hidden={selectedType !== "image"}>
                <WLabel>{t("Main.image")}</WLabel>
                <div hidden={!option?.imageURL}>
                    <img src={option?.imageURL} style={{ height: "20rem", maxWidth: "100rem" }} />
                </div>
                <WInput type="file" {...register("image")} invalid={!!errors.image} />
                <WErrorMessage error={errors.image} />
            </WField>
            <SaveAndDelete mode={mode} name={`${option?.name}`} onDelete={onDelete} onDeleted={navigateToParent} />
            <RootErrorMessage errors={errors} />
        </WForm>
    )
}

export default InspirationOptionForm
