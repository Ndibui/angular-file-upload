import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FileDialogPayload, FileDialogData } from '../../../models/file-upload/file-dialog-data';
import { FileDialogActionTypes } from '../../../models/const/upload-file-dialog-action-types';

@Component({
  selector: 'app-file-upload-dialog',
  templateUrl: './file-upload-dialog.component.html',
  styleUrls: ['./file-upload-dialog.component.scss']
})
export class FileUploadDialogComponent implements OnInit {
  hasMultiple: boolean;
  dialogActionsEnum = FileDialogActionTypes;
  dialogActions = [];
  constructor(
    public dialogRef: MatDialogRef<FileUploadDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FileDialogPayload
  ) {
    this.hasMultiple = data.payload.length > 1 ? true : false;
    this.dialogActions = Object.keys(this.dialogActionsEnum);
   }

  ngOnInit() {
  }

  closeDialog(data?: FileDialogPayload) {
    this.dialogRef.close(data);
  }

  continue() {
    this.closeDialog(this.data);
  }

  selectedAction(action: FileDialogActionTypes) {
    this.data.payload[0].dialogAction = action;
    this.closeDialog(this.data);
  }
}
