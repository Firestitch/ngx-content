import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { FsExampleModule } from '@firestitch/example';
import { FsMessageModule } from '@firestitch/message';
import { 
  FsContentPagesModule, 
  FS_CONTENT_CONFIG,
  FsContentLayoutsModule,
  FsContentModule,
} from '@firestitch/content';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsHtmlEditorModule } from '@firestitch/html-editor';

import { AppMaterialModule } from './material.module';
import { ExamplesComponent } from './components';
import { AppComponent } from './app.component';
import { contentConfigFactory } from './helpers/content-config-factory';
import { ContentComponent } from './components/content';
import { ContentPagesComponent } from './components/content-pages';
import { ContentLayoutsComponent } from './components/content-layouts';
import { FsTextEditorModule } from '@firestitch/text-editor';


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
