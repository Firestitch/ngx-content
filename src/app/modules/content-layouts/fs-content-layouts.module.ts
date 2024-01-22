import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';

import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsListModule } from '@firestitch/list';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsTextEditorModule } from '@firestitch/text-editor';

import { FsContentEditorModule } from '../editor';

import { ContentLayoutEditorComponent } from './components';
import { ContentLayoutComponent } from './components/content-layout';
import { FsContentLayoutsComponent } from './components/content-layouts';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MatDialogModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    MatSelectModule,
    MatButtonToggleModule,

    FsListModule,
    FsDateModule,
    FsFormModule,
    FsLabelModule,
    FsSkeletonModule,
    FsHtmlEditorModule,
    FsDialogModule,
    FsTextEditorModule,

    FsContentEditorModule,
  ],
  exports: [
    FsContentLayoutsComponent,
  ],
  declarations: [
    ContentLayoutComponent,
    FsContentLayoutsComponent,
    ContentLayoutEditorComponent,
  ],
})
export class FsContentLayoutsModule {
}
