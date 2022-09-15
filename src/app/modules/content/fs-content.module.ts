import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { FsContentComponent } from './components/content';
import { ContentRendererComponent } from './components/content-renderer';



@NgModule({
  imports: [
    CommonModule,

    FsHtmlEditorModule,
  ],
  exports: [
    FsContentComponent,
  ],
  declarations: [
    FsContentComponent,
    ContentRendererComponent,
  ],
})
export class FsContentModule {
}
