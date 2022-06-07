import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTextEditorModule } from '@firestitch/text-editor';

import { FsContentLayoutsComponent } from './components/content-layouts';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';
import { FsContentEditorModule } from '../editor';
import { ContentLayoutComponent } from './components/content-layout';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    FlexLayoutModule,

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
  ],
})
export class FsContentLayoutsModule {
}
