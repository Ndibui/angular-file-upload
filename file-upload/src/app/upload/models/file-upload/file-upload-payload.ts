export class FilePayload {
    constructor(initialData: Partial<FilePayload> = null) {
        if (initialData != null) {
            Object.assign(this, initialData);
        }
    }

    fileId: string;
    name: string;
    file: File;
    skip: boolean;
    overWrite: boolean;
}

export class FileUploadPayload {
    constructor(initialData: Partial<FileUploadPayload> = null) {
        this.payload = initialData.payload;
    }

    payload: FilePayload[];
}
