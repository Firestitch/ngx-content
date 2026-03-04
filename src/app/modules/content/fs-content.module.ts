import { ModuleWithProviders, NgModule } from '@angular/core';

import { ContentRendererComponent } from './components/content-renderer/content-renderer.component';
import { FsContentComponent } from './components/content/content.component';

@NgModule({
    imports: [
        FsContentComponent,
        ContentRendererComponent,
    ],
    exports: [
        FsContentComponent,
    ],
})
export class FsContentModule {
  public static forRoot(): ModuleWithProviders<FsContentModule> {
    return {
      ngModule: FsContentModule,
    };
  }
}
