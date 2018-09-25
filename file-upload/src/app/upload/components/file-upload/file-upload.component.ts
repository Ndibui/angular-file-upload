import { Component, OnInit, OnDestroy, ViewChild, ElementRef, Input } from '@angular/core';
import { Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { UploadFileTypes } from '../../models/const/upload-file-types';
import { FileUpload } from '../../models/file-upload/file-upload';
import { FileUploadValidationStatus } from '../../models/const/upload-file-validation-status';
import { Store } from '@ngrx/store';
import * as fromStore from '../../reducers';
import { UploadFiles, DeleteFile } from '../../actions/file-upload.actions';
import { v4 as uuid } from 'uuid';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { FileUploadDialogComponent } from './file-upload-dialog/file-upload-dialog.component';
import { FileDialogData, FileDialogPayload } from '../../models/file-upload/file-dialog-data';
import { FileDialogActionTypes } from '../../models/const/upload-file-dialog-action-types';
import { FilePayload, FileUploadPayload } from '../../models/file-upload/file-upload-payload';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent implements OnInit, OnDestroy {

  @Input() fileMaxSize: number;
  @Input() maxFiles = 1;
  @Input() allowedFileTypes: UploadFileTypes[];
  @ViewChild('file') file: ElementRef;
  uploadedFiles: Array<FileUpload>;
  uploadedFiles$ = new BehaviorSubject<Array<FileUpload>>(null);
  validationErrorMsg: string;
  subscription: Subscription;
  dialogActionType: FileDialogActionTypes;
  dialogData: FileDialogData[];
  duplicateFiles: FilePayload[];
  dragdropErrorMsgs: string[];
  constructor(
    public dialog: MatDialog,
    private readonly store: Store<fromStore.AppState>
  ) {
    this.uploadedFiles = [];
    this.dragdropErrorMsgs = [];
  }

  showTagInput = false;
  disableUpload = false;
  allowMultiple = false;
  availableTags: string[] = ['Regional', 'Confidential'];
  remainingFiles: number;

  ngOnInit() {
    this.remainingFiles = this.maxFiles;
    this.allowMultiple = this.maxFiles > 1;

    this.subscription = combineLatest(
      this.store.select(fromStore.getFileUploadSelectors.getUploadingFiles),
      this.store.select(fromStore.getFileUploadSelectors.getUploadedFiles),
      this.store.select(fromStore.getFileUploadSelectors.getUploadingState)
    ).subscribe(([uploadingFiles, uploadedFiles, uploading]) => {
      if (uploading) {
        if (uploadingFiles) {
          this.uploadedFiles = uploadingFiles;
        }
      } else {
        if (uploadedFiles) {
          this.uploadedFiles = uploadedFiles;
          this.remainingFiles = this.maxFiles - uploadedFiles.length;
        }
      }
      this.uploadedFiles$.next(this.uploadedFiles);
      this.toggleFileUpload();
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  onFilesAdded(files?: FileList) {
    this.dragdropErrorMsgs = [];
    const filesList = new Set<File>();
    files = files ? files : this.file.nativeElement.files;
    for (const key in files) {
      if (!isNaN(parseInt(key, 10))) {
        const validStatus = this.validateFilesAdded(files[key]);
        if (validStatus === FileUploadValidationStatus.Valid) {
          filesList.add(files[key]);
        }
      }
    }
    if (filesList.size > 0) {
      const fileListArray = Array.from(filesList);
      const filePayload = fileListArray.map(listItem => new FilePayload({
        fileId: uuid(),
        name: this.formatFileName(listItem.name),
        file: listItem,
        skip: false,
        overWrite: false
      })
      );
      this.duplicateFiles = filePayload.filter(file => this.checkFileExists(file.name));
      if (this.duplicateFiles.length > 0) {
        this.handleDuplicateFiles(filePayload);
      } else {
        this.uploadFiles(new FileUploadPayload({ payload: filePayload }));
      }
    }
    this.file.nativeElement.value = '';
  }

  private formatFileName(name: string): string {
    const nameArr = name.split(new RegExp(/\.+\w+$/g)); // split at last ".", if name has more than one "."
    return nameArr[0];
  }

  private handleDuplicateFiles(payload: FilePayload[]) {
    this.dialogData = [];
    this.dialogData = this.duplicateFiles.map(
      file => new FileDialogData(
        { fileName: file.name,
          dialogAction: FileDialogActionTypes.CancelUpload
        })
      );
    const dialogPayload = new FileDialogPayload({ payload: this.dialogData });
    this.actionOnDuplicateFiles(dialogPayload, payload);
  }

  private validateFilesAdded(file: File) {
    let fileIsValid = this.checkFileType(file);
    if (fileIsValid === FileUploadValidationStatus.Valid) {
      fileIsValid = this.checkFileSize(file);
    }

    return fileIsValid;
  }

  private actionOnDuplicateFiles(dialogPayload: FileDialogPayload, filePayload: FilePayload[]): void {
    const config: MatDialogConfig = {
      width: '50%',
      data: dialogPayload
    };
    const dialogRef = this.dialog.open(FileUploadDialogComponent, config);
    dialogRef.afterClosed().subscribe((result: FileDialogPayload) => {
      this.dialogData = [];
      if (!!result) {
        this.dialogData = result.payload;
        filePayload.forEach(file => {
          const dialog = this.dialogData.find(data => data.fileName === file.name);
          if (!!dialog) {
            if (dialog.dialogAction === FileDialogActionTypes.CancelUpload) {
              file.skip = true;
            } else if (dialog.dialogAction === FileDialogActionTypes.KeepBoth) {
              file.name = this.getNewFileName(file.name);
            } else if (dialog.dialogAction === FileDialogActionTypes.Replace) {
              file.overWrite = true;
            }
          }
        });
      }
      this.uploadFiles(new FileUploadPayload({ payload: filePayload }));
    });
  }

  private checkFileType(file: File): FileUploadValidationStatus {
    const type = file.type;
    let validFileType = FileUploadValidationStatus.InValidType;
    this.allowedFileTypes = !!this.allowedFileTypes ? this.allowedFileTypes : Object.values(UploadFileTypes);
    const fileTypeExists = this.allowedFileTypes.find(fileType => fileType === type);
    if (!!fileTypeExists) {
      validFileType = FileUploadValidationStatus.Valid;
    } else {
      const errorMsg = file.name + FileUploadValidationStatus.InValidType;
      this.handleErrorMsg(errorMsg);
    }
    return validFileType;
  }

  private checkFileSize(file: File): FileUploadValidationStatus {
    const size = file.size;
    let validFileSize = FileUploadValidationStatus.InValidSize;
    if (size <= this.fileMaxSize) {
      validFileSize = FileUploadValidationStatus.Valid;
    } else {
      const errorMsg = file.name + FileUploadValidationStatus.InValidSize + this.fileMaxSize;
      this.handleErrorMsg(errorMsg);
    }
    return validFileSize;
  }

  private checkFileExists(name: string): boolean {
    let fileExists = false;
    const validity = this.uploadedFiles.findIndex(file => file.name === name);
    fileExists = validity >= 0 ? true : false;
    return fileExists;
  }

  uploadFiles(files: FileUploadPayload) {
    this.store.dispatch(new UploadFiles(files));
  }

  removeUploadedFile(fileId: string) {
    this.store.dispatch(new DeleteFile({ fileId: fileId }));
  }

  private getNewFileName(name: string) {
    const duplicateNamingRegExp = new RegExp(/(\(\d\))+\./g);
    const nameParts = name.split(duplicateNamingRegExp);
    const originalName = nameParts[0];
    const duplicateNames = this.uploadedFiles.filter(file => file.name.startsWith(originalName));
    return originalName + '(' + duplicateNames.length + ')';
  }

  toggleFileUpload() {
    if (this.uploadedFiles.length === this.maxFiles) {
      this.disableUpload = true;
    } else if (this.uploadedFiles.length < this.maxFiles) {
      this.disableUpload = false;
    }
  }

  handleErrorMsg(message: string, clearExisting?: boolean) {
    if (clearExisting) {
      this.dragdropErrorMsgs = [];
    }
    this.dragdropErrorMsgs.push(message);
  }
}
