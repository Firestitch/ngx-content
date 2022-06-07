import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { FsListModule } from '@firestitch/list';
import { FsDateModule } from '@firestitch/date';
import { FsDialogModule } from '@firestitch/dialog';
import { FsFormModule } from '@firestitch/form';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTextEditorModule } from '@firestitch/text-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsSkeletonModule } from '@firestitch/skeleton';

import { ContentPageComponent } from './components/content-page';
import { FsContentPagesComponent } from './components/content-pages';
import { FsContentEditorModule } from '../editor';

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
    FsContentPagesComponent,
  ],
  declarations: [
    FsContentPagesComponent,
    ContentPageComponent,
  ],
})
export class FsContentPagesModule {
  static forRoot(): ModuleWithProviders<FsContentPagesModule> {
    return {
      ngModule: FsContentPagesModule,
    };
  }
}
