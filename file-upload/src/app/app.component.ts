import { Component, OnInit } from '@angular/core';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'cancel',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/cancel.svg'));
    iconRegistry.addSvgIcon(
      'file-pdf',
      sanitizer.bypassSecurityTrustResourceUrl('assets/icons/file-pdf.svg'));
  }
  ngOnInit(): void {

  }
}
