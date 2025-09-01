import type { FileUpload } from "../api/models/api"

export interface UploadJob<Type> {
    fileUpload: FileUpload
    target: Type
}
