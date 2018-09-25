import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { UploadService } from '../services/upload.service';
import { Observable, of } from 'rxjs';
import { Action } from '@ngrx/store';
import {
    UploadActionTypes,
    UploadFiles,
    UploadFilesSuccess,
    UploadFileProgress,
    UploadFilesFail,
    DeleteFile,
    RemoveFilePayload,
    DeleteFileSuccess,
    DeleteFileFail
} from '../actions/file-upload.actions';
import { FileUpload } from '../models/file-upload/file-upload';
import { map, switchMap, catchError } from 'rxjs/operators';


@Injectable()
export class UploadEffects {
    @Effect()
    uploadFiles$: Observable<Action> = this.actions$.pipe(
        ofType(UploadActionTypes.UploadFiles),
        switchMap((action: UploadFiles) => this.service.uploadFiles(action.payload)
            .pipe(
                map((data: FileUpload[]) => {
                    let completed = false;
                    const allComplete = data.find(file => file.progress !== 100);
                    completed = !allComplete;
                    return completed ? new UploadFilesSuccess(data) : new UploadFileProgress(data);
                }),
                catchError(error => of(new UploadFilesFail(error)))
            )
        )
    );

    @Effect()
    removeFile$: Observable<Action> = this.actions$.pipe(
        ofType(UploadActionTypes.DeleteFile),
        switchMap((action: DeleteFile) => this.service.removeFile(action.payload)
            .pipe(
                map((data: RemoveFilePayload) => new DeleteFileSuccess(data)),
                catchError(error => of(new DeleteFileFail(error)))
            )
        )
    );

    constructor(private readonly actions$: Actions, private readonly service: UploadService) { }
}
