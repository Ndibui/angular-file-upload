import { Action } from '@ngrx/store';
import { FileUploadPayload } from '../models/file-upload/file-upload-payload';
import { FileUpload } from '../models/file-upload/file-upload';

export enum UploadActionTypes {
    UploadFiles = '[FileUpload] Upload Files',
    UploadFileProgress = '[FileUpload] Upload File Progress',
    UploadFilesSuccess = '[FileUpload] Upload Files Success',
    UploadFilesFail = '[FileUpload] Upload Files Fail',

    DeleteFile = '[FileUpload] Delete File',
    DeleteFileSuccess = '[FileUpload] Delete File Success',
    DeleteFileFail = '[FileUpload] Delete File Fail',

    Reset = '[FileUpload] Reset'
}
export class UploadFiles implements Action {
    readonly type = UploadActionTypes.UploadFiles;
    constructor(public payload: FileUploadPayload) {}
}

export class UploadFileProgress implements Action {
    readonly type = UploadActionTypes.UploadFileProgress;
    constructor(public payload: FileUpload[]) { }
}

export class UploadFilesSuccess implements Action {
    readonly type = UploadActionTypes.UploadFilesSuccess;
    constructor(public payload: FileUpload[]) {}
}

export class UploadFilesFail implements Action {
    readonly type = UploadActionTypes.UploadFilesFail;
    constructor(public payload: any) { }
}

export class DeleteFile implements Action {
    readonly type = UploadActionTypes.DeleteFile;
    constructor(public payload: RemoveFilePayload) { }
}

export class DeleteFileSuccess implements Action {
    readonly type = UploadActionTypes.DeleteFileSuccess;
    constructor(public payload: RemoveFilePayload) { }
}

export class DeleteFileFail implements Action {
    readonly type = UploadActionTypes.DeleteFileFail;
    constructor(public payload: any) { }
}

export class ResetFileUpload implements Action {
    readonly type = UploadActionTypes.Reset;
}

export type UploadFileActions = UploadFileProgress
| UploadFiles
| UploadFilesSuccess
| UploadFilesFail
| DeleteFile
| DeleteFileSuccess
| DeleteFileFail
| ResetFileUpload;


export interface RemoveFilePayload { fileId: string; }
