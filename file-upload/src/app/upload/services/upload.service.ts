import { Injectable } from '@angular/core';
import { HttpClient, HttpEventType, HttpRequest, HttpResponse } from '@angular/common/http';
import { FileUpload } from '../models/file-upload/file-upload';
import { Observable, BehaviorSubject, combineLatest, of } from 'rxjs';
import { skip } from 'rxjs/operators';
import { FileUploadPayload, FilePayload } from '../models/file-upload/file-upload-payload';
import { RemoveFilePayload } from '../actions/file-upload.actions';

const url = 'http://localhost:8000/upload';

@Injectable()
export class UploadService {
    constructor(
        private readonly http: HttpClient
      ) { }

      uploadFile(payload: FilePayload): Observable<FileUpload> {
        const result = new BehaviorSubject<FileUpload>(new FileUpload());
        const formData: FormData = new FormData();
        formData.append('id', payload.fileId);
        formData.append('file', payload.file, payload.name);
        formData.append('name', payload.name);
        formData.append('overWrite', payload.overWrite.toString());

        const req = new HttpRequest('POST', url, formData, {
          reportProgress: true
        });

        const uploadProgress = new FileUpload({ id: payload.fileId, name: payload.name, overwriteExisting: payload.overWrite });
        this.http.request(req).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            result.next(
              new FileUpload({
                ...uploadProgress,
                progress: percentDone,
                uploading: percentDone === 100 ? false : true,
                uploadSuccessful: percentDone === 100 ? true : false
              }));
          } else if (event instanceof HttpResponse) {
            result.complete();
          }
        });
        return result.asObservable().pipe(skip(1));
      }

      uploadFiles(files: FileUploadPayload): Observable<FileUpload[]> {
        const result = new BehaviorSubject<FileUpload[]>([new FileUpload()]);
        const arrFiles = files.payload.filter(file => !file.skip);
        const observables = arrFiles.map(
          file => this.uploadFile(file)
        );
        combineLatest(observables).subscribe(val => {
          result.next(val);
        });
        return result.asObservable().pipe(skip(1));
      }

      removeFile(data: RemoveFilePayload): Observable<RemoveFilePayload> {
        return of(data);
      }
}
