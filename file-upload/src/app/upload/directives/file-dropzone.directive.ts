import { Directive, HostListener, HostBinding, Output, EventEmitter } from '@angular/core';


export interface UploadFiles {
  [key: string]: File;
}

@Directive({
  selector: '[appFileDropzone]'
})

export class FileDropzoneDirective {

  @HostBinding('style.background') private background = '#eee';

  @Output() dropped = new EventEmitter<FileList>();
  constructor() { }
  preparedFiles: UploadFiles;

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;
    this.background = '#999';
    if (files.length > 0) {
      // console.log('dragover: ', files);
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.background = '#eee';
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      this.dropped.emit(files);
      this.background = '#eee';
    }
  }

}
