import axios from "axios"
import { fileUploadsCreate } from "../api/endpoints/api"
import type { FileUpload } from "../api/models/api"
import { UPLOAD_SIZE_LIMIT } from "./constants"

const doUpload = <Type>(fileUpload: FileUpload, file: File, object: Type, onSuccess: (fileUpload: FileUpload, object: Type) => void, onError: (error: unknown) => void) => {
    const url = fileUpload.fileUploadURL
    if (import.meta.env.VITE_APP_UPLOAD_MODE === "POST") {
        const formData = new FormData()
        formData.append("file", file)
        const options = {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
        axios
            .post(url, formData, options)
            .then(() => onSuccess(fileUpload, object))
            .catch(onError)
    } else {
        const options = {
            headers: {
                "Content-Type": file.type,
            },
        }
        axios
            .put(url, file, options)
            .then(() => onSuccess(fileUpload, object))
            .catch(onError)
    }
}

export const handleUpload = <Type>(object: Type, fieldName: string, fileList: FileList, onSuccess: (fileUpload: FileUpload, object: Type) => void, onError: (error: unknown) => void) => {
    const file = fileList.item(0)!
    if (file.size > UPLOAD_SIZE_LIMIT) {
        onError({ manualErrors: [{ field: fieldName, code: "too_big" }] })
    } else {
        fileUploadsCreate({ fileName: file.name })
            .then((response) => doUpload(response, file, object, onSuccess, onError))
            .catch(onError)
    }
}
