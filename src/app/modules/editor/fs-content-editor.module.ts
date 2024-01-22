import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';

import { FsCommonModule } from '@firestitch/common';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTextEditorModule } from '@firestitch/text-editor';

import { AngularSplitModule } from 'angular-split';

import { EditorComponent } from './components/editor';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatButtonToggleModule,

    FsListModule,
    FsFormModule,
    FsSkeletonModule,
    FsLabelModule,
    FsHtmlEditorModule,
    FsCommonModule,
    FsDialogModule,
    FsTextEditorModule,

    AngularSplitModule,
  ],
  exports: [
    EditorComponent,
  ],
  declarations: [
    EditorComponent,
  ],
})
export class FsContentEditorModule {
}
