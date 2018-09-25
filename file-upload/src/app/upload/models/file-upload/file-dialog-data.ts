import { FileDialogActionTypes } from '../const/upload-file-dialog-action-types';

export class FileDialogData {
    constructor(initialData: Partial<FileDialogData> = null) {
        if (initialData != null) {
            Object.assign(this, initialData);
        }
    }
    fileName: string;
    dialogAction: FileDialogActionTypes;
}
export class FileDialogPayload {
    constructor(initialData: Partial<FileDialogPayload> = null) {
        this.payload = initialData.payload;
    }

    payload: FileDialogData[];
}
