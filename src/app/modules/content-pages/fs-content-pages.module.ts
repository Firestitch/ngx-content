import { ModuleWithProviders, NgModule } from '@angular/core';

import { ContentPageEditorComponent } from './components';
import { ContentPageComponent } from './components/content-page';
import { FsContentPagesComponent } from './components/content-pages';

@NgModule({
    imports: [
        FsContentPagesComponent,
        ContentPageComponent,
        ContentPageEditorComponent,
    ],
    exports: [
        FsContentPagesComponent,
    ],
})
export class FsContentPagesModule {
  public static forRoot(): ModuleWithProviders<FsContentPagesModule> {
    return {
      ngModule: FsContentPagesModule,
    };
  }
}
