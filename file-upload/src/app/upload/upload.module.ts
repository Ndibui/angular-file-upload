import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadService } from './services/upload.service';
import { DialogComponent } from './components/dialog/dialog.component';
import { UploadComponent } from './components/upload/upload.component';
import { HttpClientModule } from '../../../node_modules/@angular/common/http';
import { FileDropzoneDirective } from './directives/file-dropzone.directive';

@NgModule({
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule
  ],
  exports: [UploadComponent],
  declarations: [DialogComponent, UploadComponent, FileDropzoneDirective],
  providers: [UploadService],
  entryComponents: [DialogComponent]
})
export class UploadModule { }
