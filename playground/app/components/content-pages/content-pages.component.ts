import { Component, OnInit } from '@angular/core';
import { FsHtmlEditorConfig } from '@firestitch/html-editor';

import { of } from 'rxjs';
import { FsContentPagesComponent } from '../../../../src/app/modules/content-pages/components/content-pages/content-pages.component';


@Component({
    selector: 'app-content-pages',
    templateUrl: './content-pages.component.html',
    styleUrls: ['./content-pages.component.scss'],
    standalone: true,
    imports: [FsContentPagesComponent]
})
export class ContentPagesComponent implements OnInit {

  public ngOnInit(): void {
  }

}
