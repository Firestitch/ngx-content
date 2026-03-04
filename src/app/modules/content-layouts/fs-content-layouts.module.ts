import { ModuleWithProviders, NgModule } from '@angular/core';

import { ContentLayoutEditorComponent } from './components/content-layout-editor/content-layout-editor.component';
import { ContentLayoutComponent } from './components/content-layout/content-layout.component';
import { FsContentLayoutsComponent } from './components/content-layouts/content-layouts.component';

@NgModule({
    imports: [
        FsContentLayoutsComponent,
        ContentLayoutComponent,
        ContentLayoutEditorComponent,
    ],
    exports: [
        FsContentLayoutsComponent,
    ],
})
export class FsContentLayoutsModule {
  public static forRoot(): ModuleWithProviders<FsContentLayoutsModule> {
    return {
      ngModule: FsContentLayoutsModule,
    };
  }
}
