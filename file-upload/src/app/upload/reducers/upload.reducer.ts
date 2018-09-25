import { UploadFileActions, UploadActionTypes } from '../actions/file-upload.actions';
import { FileUpload } from '../models/file-upload/file-upload';

export interface State {
    uploadingFiles: FileUpload[];
    uploadedFiles: FileUpload[];
    uploading: boolean;
}

const initialState: State = {
    uploadingFiles: null,
    uploadedFiles: null,
    uploading: false
};


export function reducer(
    state = initialState,
    action: UploadFileActions
    ): State {
    switch (action.type) {
        case UploadActionTypes.UploadFiles: {
            return {
                ...state,
                uploading: true
            };
        }
        case UploadActionTypes.UploadFileProgress: {
            return {
                ...state,
                uploading: true,
                uploadingFiles: action.payload
            };
        }
        case UploadActionTypes.UploadFilesSuccess: {
            const existingFiles = Object.assign([], state.uploadedFiles);
            const payloadFiles = action.payload.filter(file => file.progress === 100);
            payloadFiles.forEach(payloadFile => {
                const removeItemIndex = existingFiles.findIndex(existingFile => existingFile.name === payloadFile.name);
                if (removeItemIndex >= 0) {
                    existingFiles.splice(removeItemIndex, 1);
                }
            });
            const newUploadedFiles = existingFiles.concat(payloadFiles);
            return {
                ...state,
                uploading: false,
                uploadingFiles: null,
                uploadedFiles: newUploadedFiles
            };
        }
        case UploadActionTypes.UploadFilesFail: {
            return {
                ...state,
                uploadedFiles: action.payload
            };
        }
        case UploadActionTypes.DeleteFileSuccess: {
            const newUploadedFilesArray = [...state.uploadedFiles].filter(uploadedFile => uploadedFile.id !== action.payload.fileId);
            return {
                ...state,
                uploadedFiles: newUploadedFilesArray
            };
        }

        case UploadActionTypes.Reset: {
            return initialState;
        }

        default: {
            return state;
        }
    }
}

export const getUploadingFiles = (state: State) => state.uploadingFiles;
export const getUploadedFiles = (state: State) => state.uploadedFiles;
export const getUploadingState = (state: State) => state.uploading;
