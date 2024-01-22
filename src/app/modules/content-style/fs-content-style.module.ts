import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';

import { FsCommonModule } from '@firestitch/common';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTextEditorModule } from '@firestitch/text-editor';

import { FsContentEditorModule } from '../editor';

import { ContentStyleComponent } from './components/content-style';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,

    FsTextEditorModule,
    FsSkeletonModule,
    FsCommonModule,
    FsContentEditorModule,
  ],
  exports: [
    ContentStyleComponent,
  ],
  declarations: [
    ContentStyleComponent,
  ],
})
export class FsContentStyleModule {
}
