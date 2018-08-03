import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEventType, HttpResponse } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';

const url = 'http://localhost:8000/upload';

export interface Progress {
  progress: Observable<number>;
}

export interface UploadProgress {
  [key: string]: Progress;
}

@Injectable({
  providedIn: 'root'
})

export class UploadService {
  constructor(private http: HttpClient) { }

  public upload(files: Set<File>): UploadProgress {
    const status = {};
    files.forEach(file => {
      // create a new multipart-form for every file
      const formData: FormData = new FormData();
      formData.append('file', file, file.name);

      // create a http-post request and pass the form
      // tell it to report the upload progress
      const req = new HttpRequest('POST', url, formData, {
        reportProgress: true
      });

      // progress-subject for every file
      const progress = new Subject<number>();

      // send request and subscribe for progress-updates
      this.http.request(req).subscribe(event => {
        if (event.type === HttpEventType.UploadProgress) {
          // calculate progress percentage
          const percentDone = Math.round(100 * event.loaded / event.total);

          // update progress
          progress.next(percentDone);
        } else if (event instanceof HttpResponse) {
          // Close the progress-stream if we get an answer form the API
          // The upload is complete
          progress.complete();
        }
      });

      // Save every progress-observable in a map of all observables
      status[file.name] = {
        progress: progress.asObservable()
      };
    });
    console.log(status);
    // return the map of progress.observables
    return status;
  }
}
