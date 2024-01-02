import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';

import {
  FS_CONTENT_CONFIG,
  FsContentLayoutsModule,
  FsContentModule,
  FsContentPagesModule,
} from '@firestitch/content';
import { FsExampleModule } from '@firestitch/example';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsLabelModule } from '@firestitch/label';
import { FsMessageModule } from '@firestitch/message';
import { FsStoreModule } from '@firestitch/store';

import { FsTextEditorModule } from '@firestitch/text-editor';
import { AppComponent } from './app.component';
import { ExamplesComponent } from './components';
import { ContentComponent } from './components/content';
import { ContentLayoutsComponent } from './components/content-layouts';
import { ContentPagesComponent } from './components/content-pages';
import { contentConfigFactory } from './helpers/content-config-factory';
import { AppMaterialModule } from './material.module';


const routes: Routes = [
  { path: '', component: ExamplesComponent },
];

@NgModule({
  bootstrap: [ AppComponent ],
  imports: [
    BrowserModule,
    FsContentPagesModule,
    FsContentLayoutsModule,
    BrowserAnimationsModule,
    FsContentModule,
    AppMaterialModule,
    FormsModule,
    FsLabelModule,
    FsStoreModule,
    FsExampleModule.forRoot(),
    FsHtmlEditorModule.forRoot(),
    FsTextEditorModule.forRoot(),
    FsMessageModule.forRoot(),
    RouterModule.forRoot(routes),
  ],
  providers: [
    { provide: FS_CONTENT_CONFIG, 
      useFactory: contentConfigFactory, 
      deps: [ ] 
    },
  ],
  declarations: [
    AppComponent,
    ExamplesComponent,
    ContentPagesComponent,
    ContentComponent,
    ContentLayoutsComponent,
  ],
})
export class PlaygroundModule {
}
