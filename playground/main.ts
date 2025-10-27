import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';


import { environment } from './environments/environment';
import { FS_CONTENT_CONFIG, FsContentPagesModule } from '@firestitch/content';
import { contentConfigFactory } from './app/helpers/content-config-factory';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { FsLabelModule } from '@firestitch/label';
import { FsStoreModule } from '@firestitch/store';
import { FsExampleModule } from '@firestitch/example';
import { FsHtmlEditorModule } from '@firestitch/html-editor';
import { FsTextEditorModule } from '@firestitch/text-editor';
import { FsMessageModule } from '@firestitch/message';
import { provideRouter, Routes } from '@angular/router';
import { ExamplesComponent } from './app/components';
import { AppComponent } from './app/app.component';

const routes: Routes = [
  { path: '', component: ExamplesComponent },
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FsContentPagesModule, FormsModule, FsLabelModule, FsStoreModule, FsExampleModule.forRoot(), FsHtmlEditorModule.forRoot(), FsTextEditorModule.forRoot(), FsMessageModule.forRoot()),
        { provide: FS_CONTENT_CONFIG,
            useFactory: contentConfigFactory,
            deps: [],
        },
        provideAnimations(),
        provideRouter(routes),
    ]
})
  .catch(err => console.error(err));

