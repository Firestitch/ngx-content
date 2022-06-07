import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';

import { FsListModule } from '@firestitch/list';
import { FsLabelModule } from '@firestitch/label';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTextEditorModule } from '@firestitch/text-editor';

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
    FsLabelModule,
    FsHtmlEditorModule,
    FsDialogModule,
    FsTextEditorModule,
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
