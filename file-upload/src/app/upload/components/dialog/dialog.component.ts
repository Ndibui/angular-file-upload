import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { UploadService } from '../../services/upload.service';
import { forkJoin, Observable } from 'rxjs';
// import { forkJoin } from 'rxjs/observable/forkJoin';

export interface Progress {
  progress: Observable<number>;
}

export interface UploadProgress {
  [key: string]: Progress;
}

export interface UploadFiles {
  [key: string]: File;
}

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {


  @ViewChild('file') file: ElementRef;
  files: Set<File>  = new Set();
  progress: UploadProgress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;

  constructor(
    private dialogRef: MatDialogRef<DialogComponent>,
    private uploadService: UploadService) { }

  ngOnInit() {
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded(files?: FileList) {
    files = files ? files : this.file.nativeElement.files;
    console.log('files: ', files);
    for (const key in files) {
      // tslint:disable-next-line:radix
      if (!isNaN(parseInt(key))) {
        this.files.add(files[key]);
      }
    }
  }

  closeDialog() {
    if (this.uploadSuccessful) {
      return this.dialogRef.close();
    }

    this.uploading = true;
    this.progress = this.uploadService.upload(this.files); // start upload, track progress
    const allProgressObservables: Array<Observable<number>> = [];
    for (const key in this.progress) {
      if (this.progress.hasOwnProperty(key)) {
        allProgressObservables.push(this.progress[key].progress);
      }
    }
    this.primaryButtonText = 'Finish';

    // disable close when uploading
    this.canBeClosed = false;
    this.dialogRef.disableClose = true;
    this.showCancelButton = false;

    forkJoin(allProgressObservables).subscribe(end => {
      this.canBeClosed = true;
      this.dialogRef.disableClose = false;
      this.uploadSuccessful = true;
      this.uploading = false;
    });

  }

}
