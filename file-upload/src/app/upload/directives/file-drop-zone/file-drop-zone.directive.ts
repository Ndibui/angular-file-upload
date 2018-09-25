import { Directive, HostBinding, Output, EventEmitter, HostListener, Input, OnChanges, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appFileDropZone]'
})
export class FileDropZoneDirective implements OnChanges {

  @HostBinding('class.drag-zone-active') private dragZoneActive = false;
  @HostBinding('class.drag-zone-disabled') private dragZoneDisabled = false;
  @Output() dropped = new EventEmitter<FileList>();
  @Output() errorMsg = new EventEmitter<string>();
  @Input() isDisabled = false;
  @Input() filesToUpload = 1;
  @Input() maxFiles = 1;
  constructor() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.isDisabled) {
      this.dragZoneDisabled = changes.isDisabled.currentValue;
    }
  }

  @HostListener('dragover', ['$event']) onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDisabled) {
      this.dragZoneActive = true;
    }
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDisabled) {
      this.dragZoneActive = (event.srcElement.className !== 'drag-label') ? false : this.dragZoneActive;
    }
  }

  @HostListener('drop', ['$event']) public onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (!this.isDisabled) {
      const files = event.dataTransfer.files;
      if (files.length > 0 && files.length <= this.filesToUpload) {
        this.dropped.emit(files);
      } else if (files.length > this.filesToUpload) {
        const suffix = this.maxFiles > 1 ? 's.' : '.';
        this.errorMsg.emit('You can only upload ' + this.maxFiles + ' file' + suffix);
      }
      this.dragZoneActive = false;
    }
  }
}
