export class FileUpload {
    constructor(initialData: Partial<FileUpload> = null) {
        if (initialData != null) {
            Object.assign(this, initialData);
        }
    }

    id: string;
    name: string;
    fileType: string;
    deleted: boolean;
    overwriteExisting: boolean;
    progress?: number;
    uploading?: boolean;
    uploadSuccessful?: boolean;
}
