import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload.service';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {

  constructor(
    private dialog: MatDialog,
    private uploadService: UploadService) { }

  ngOnInit() {
  }

  openUploadDialog() {
    const dialogRef = this.dialog.open(DialogComponent, { width: '50%', height: '50%' });
  }

}
