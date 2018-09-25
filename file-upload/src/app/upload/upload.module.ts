import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatButtonModule,
  MatDialogModule,
  MatListModule,
  MatProgressBarModule,
  MatRadioModule,
  MatIconModule,
  MatInputModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadService } from './services/upload.service';
import { HttpClientModule } from '@angular/common/http';
import { FileDropZoneDirective } from './directives/file-drop-zone/file-drop-zone.directive';
import { StoreModule } from '@ngrx/store';
import { reducers } from './reducers';
import { EffectsModule } from '@ngrx/effects';
import { UploadEffects } from './effects/upload.effects';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { FileUploadDialogComponent } from './components/file-upload/file-upload-dialog/file-upload-dialog.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatRadioModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    HttpClientModule,
    StoreModule.forFeature('upload', reducers),
    EffectsModule.forFeature([UploadEffects])
  ],
  exports: [
    CommonModule,
    FormsModule,
    FileUploadComponent,
    FileDropZoneDirective,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatListModule,
    MatRadioModule,
    MatProgressBarModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
  ],
  declarations: [
    FileUploadDialogComponent,
    FileUploadComponent,
    FileDropZoneDirective
  ],
  providers: [
    UploadService
  ],
  entryComponents: [
    FileUploadDialogComponent
  ]
})
export class UploadModule { }
